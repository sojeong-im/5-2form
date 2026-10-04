import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Trash2, 
  Phone, 
  Search, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink,
  Users
} from 'lucide-react'
import { db } from './firebase'
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'

export default function Admin({ onBack }: { onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('eatseoul_admin_auth') === 'true';
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | '남성' | '여성'>('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '00347') {
      sessionStorage.setItem('eatseoul_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 일치하지 않습니다.");
      setPassword('');
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('eatseoul_admin_auth');
    setIsAuthenticated(false);
    onBack();
  }

  const fetchApplications = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      let data: any[] = [];
      try {
        // 1차 시도: submittedAt 기준 내림차순 정렬 쿼리
        const q = query(collection(db, "applications"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (orderErr: any) {
        console.warn("OrderBy 쿼리 실패, 전체 목록 조회 후 클라이언트 정렬 시도:", orderErr);
        // 2차 시도: 인덱스나 필드 누락 시 기본 조회 후 메모리 정렬
        const querySnapshot = await getDocs(collection(db, "applications"));
        data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        data.sort((a, b) => {
          const getMillis = (item: any) => {
            if (!item?.submittedAt) return 0;
            if (typeof item.submittedAt.toMillis === 'function') return item.submittedAt.toMillis();
            if (item.submittedAt.seconds) return item.submittedAt.seconds * 1000;
            const parsed = new Date(item.submittedAt).getTime();
            return isNaN(parsed) ? 0 : parsed;
          };
          return getMillis(b) - getMillis(a);
        });
      }
      setApplications(data);
    } catch (error: any) {
      console.error("Error fetching applications: ", error);
      const isPermissionDenied = 
        error?.code === 'permission-denied' || 
        error?.message?.includes('permission') || 
        error?.message?.includes('insufficient');
      
      if (isPermissionDenied) {
        setFetchError("permission-denied");
      } else {
        setFetchError(error?.message || "알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`[${name}] 님의 지원서를 정말 삭제하시겠습니까?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "applications", id));
      setApplications(prev => prev.filter(app => app.id !== id));
      alert("삭제되었습니다.");
    } catch (err: any) {
      console.error("Error deleting document: ", err);
      alert(`삭제 실패: ${err?.message || err}`);
    }
  }

  const copyPhoneNumber = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // 엑셀/CSV 내보내기 (UTF-8 with BOM)
  const exportToCSV = () => {
    if (applications.length === 0) {
      alert("다운로드할 지원서 데이터가 없습니다.");
      return;
    }

    const headers = [
      "접수번호",
      "이름",
      "나이",
      "성별",
      "연락처",
      "학교",
      "거주지",
      "최애 음식",
      "맛집 스타일",
      "지금 당장 먹고싶은 것",
      "원하는 활동",
      "사교 스타일",
      "지원 동기",
      "접수 일시"
    ];

    const rows = applications.map((app, index) => {
      let dateStr = '알 수 없음';
      if (app.submittedAt?.toDate) {
        dateStr = app.submittedAt.toDate().toLocaleString('ko-KR');
      } else if (app.submittedAt?.seconds) {
        dateStr = new Date(app.submittedAt.seconds * 1000).toLocaleString('ko-KR');
      }

      const clean = (val: any) => {
        if (Array.isArray(val)) return `"${val.join(', ').replace(/"/g, '""')}"`;
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      };

      return [
        applications.length - index,
        clean(app.name),
        clean(app.age),
        clean(app.gender),
        clean(app.phone),
        clean(app.school),
        clean(app.location),
        clean(app.favoriteFood),
        clean(app.restaurantStyle),
        clean(app.oneMenu),
        clean(app.activities),
        clean(app.socialStyle),
        clean(app.reason),
        clean(dateStr)
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateTag = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `한끼합쇼_지원자명단_${dateTag}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 필터링된 지원자 목록
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // 성별 필터
      if (genderFilter !== 'all' && app.gender !== genderFilter) {
        return false;
      }
      // 검색어 필터
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const name = (app.name || '').toLowerCase();
      const phone = (app.phone || '').toLowerCase();
      const school = (app.school || '').toLowerCase();
      const location = (app.location || '').toLowerCase();
      const food = Array.isArray(app.favoriteFood) ? app.favoriteFood.join(' ').toLowerCase() : '';
      const oneMenu = (app.oneMenu || '').toLowerCase();
      return (
        name.includes(term) ||
        phone.includes(term) ||
        school.includes(term) ||
        location.includes(term) ||
        food.includes(term) ||
        oneMenu.includes(term)
      );
    });
  }, [applications, searchTerm, genderFilter]);

  const maleCount = applications.filter(a => a.gender === '남성').length;
  const femaleCount = applications.filter(a => a.gender === '여성').length;

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center p-6 bg-order-bg"
      >
        <div className="bg-white p-8 border-4 border-order-text shadow-[8px_8px_0_#2c2c2c] max-w-sm w-full">
          <button onClick={onBack} className="flex items-center gap-2 font-bold mb-6 hover:text-order-red transition-colors text-sm">
            <ArrowLeft size={16} /> 메인으로
          </button>
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-order-yellow border-2 border-order-text rounded-full mb-3">
              <Users size={28} className="text-order-text" />
            </div>
            <h2 className="text-2xl font-black text-order-text">관리자 로그인</h2>
            <p className="text-xs text-gray-500 mt-1">한끼합쇼 지원자 관리 대시보드</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="비밀번호" 
              autoFocus
              className="border-2 border-order-line p-3 outline-none focus:border-order-text font-mono text-center tracking-widest text-lg"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className="bg-order-text text-white font-bold py-3 shadow-[2px_2px_0_#e63946] hover:translate-y-[1px] hover:translate-x-[1px] transition-all">
              입장하기
            </button>
          </form>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-order-bg py-8 px-4 md:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* 상단 네비게이션 헤더 */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b-4 border-order-text pb-4">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <span>관리자 대시보드</span>
              <span className="text-lg bg-order-red text-white px-3 py-1 rounded-full font-mono">
                총 {applications.length}명
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono">한끼합쇼 6기 신입 모집 실시간 지원서 목록</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchApplications} 
              disabled={loading}
              title="데이터 새로고침"
              className="flex items-center gap-1.5 font-bold bg-white border-2 border-order-text px-3 py-2 shadow-[2px_2px_0_#2c2c2c] hover:translate-x-[1px] hover:translate-y-[1px] disabled:opacity-50 text-sm"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              새로고침
            </button>
            <button 
              onClick={exportToCSV}
              disabled={applications.length === 0}
              title="CSV 엑셀 파일로 다운로드"
              className="flex items-center gap-1.5 font-bold bg-order-yellow border-2 border-order-text px-3 py-2 shadow-[2px_2px_0_#2c2c2c] hover:translate-x-[1px] hover:translate-y-[1px] disabled:opacity-50 text-sm text-order-text"
            >
              <Download size={15} />
              엑셀 다운로드
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 font-bold bg-white border-2 border-order-text px-3 py-2 shadow-[2px_2px_0_#2c2c2c] hover:text-order-red text-sm"
            >
              <ArrowLeft size={15} /> 나가기
            </button>
          </div>
        </div>

        {/* 통계 요약 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-3 border-2 border-order-text shadow-[3px_3px_0_#2c2c2c]">
            <div className="text-xs text-gray-500 font-bold">전체 지원자</div>
            <div className="text-2xl font-black mt-0.5">{applications.length}명</div>
          </div>
          <div className="bg-white p-3 border-2 border-order-text shadow-[3px_3px_0_#2c2c2c]">
            <div className="text-xs text-blue-600 font-bold">남성</div>
            <div className="text-2xl font-black mt-0.5">{maleCount}명</div>
          </div>
          <div className="bg-white p-3 border-2 border-order-text shadow-[3px_3px_0_#2c2c2c]">
            <div className="text-xs text-pink-600 font-bold">여성</div>
            <div className="text-2xl font-black mt-0.5">{femaleCount}명</div>
          </div>
          <div className="bg-white p-3 border-2 border-order-text shadow-[3px_3px_0_#2c2c2c]">
            <div className="text-xs text-green-600 font-bold">검색 결과</div>
            <div className="text-2xl font-black mt-0.5">{filteredApplications.length}명</div>
          </div>
        </div>

        {/* 검색 및 필터 바 */}
        <div className="bg-white p-4 border-2 border-order-text shadow-[3px_3px_0_#2c2c2c] mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="이름, 연락처, 학교, 음식 검색..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border-2 border-order-line text-sm outline-none focus:border-order-text"
            />
          </div>
          <div className="flex gap-1 w-full sm:w-auto">
            {(['all', '남성', '여성'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setGenderFilter(tab)}
                className={`px-3 py-1.5 text-xs font-bold border-2 border-order-text transition-all ${
                  genderFilter === tab 
                    ? 'bg-order-text text-white' 
                    : 'bg-white text-order-text hover:bg-gray-100'
                }`}
              >
                {tab === 'all' ? '전체 보기' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* 에러 발생 시 안내 박스 */}
        {fetchError && (
          <div className="bg-red-50 border-4 border-red-500 p-6 mb-6 shadow-[4px_4px_0_#dc2626]">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-black text-red-900 mb-1">
                  데이터 불러오기 실패
                </h3>
                {fetchError === 'permission-denied' ? (
                  <div className="text-sm text-red-800 space-y-2">
                    <p className="font-bold">
                      Firebase Firestore 보안 규칙(Rules)에 의해 읽기 권한이 차단되었습니다.
                    </p>
                    <p>
                      Firebase 콘솔의 Firestore Database &gt; <strong>규칙(Rules)</strong> 탭에서 <code className="bg-red-200 px-1 py-0.5 rounded font-mono">allow read, write: if true;</code> 로 규칙을 업데이트하고 게시해야 데이터를 정상적으로 불러올 수 있습니다.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <a 
                        href="https://console.firebase.google.com/project/eatseoul-54f9e/firestore/rules" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-600 text-white px-3 py-1.5 shadow-[2px_2px_0_#991b1b]"
                      >
                        Firebase 콘솔 규칙 설정 바로가기 <ExternalLink size={12} />
                      </a>
                      <button 
                        onClick={fetchApplications}
                        className="text-xs font-bold bg-white border-2 border-red-600 text-red-700 px-3 py-1.5 shadow-[2px_2px_0_#dc2626]"
                      >
                        규칙 수정 후 다시 시도
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-red-800">
                    <p>{fetchError}</p>
                    <button 
                      onClick={fetchApplications}
                      className="mt-3 text-xs font-bold bg-white border-2 border-red-600 text-red-700 px-3 py-1.5 shadow-[2px_2px_0_#dc2626]"
                    >
                      다시 시도
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 로딩 표시 */}
        {loading ? (
          <div className="text-center py-20 bg-white border-2 border-order-text shadow-[4px_4px_0_#2c2c2c]">
            <RefreshCw className="animate-spin mx-auto text-order-red mb-3" size={32} />
            <div className="font-bold text-lg">Firebase에서 지원서를 불러오는 중입니다...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredApplications.map((app, index) => {
              const formattedDate = app.submittedAt?.toDate 
                ? app.submittedAt.toDate().toLocaleString('ko-KR')
                : (app.submittedAt?.seconds ? new Date(app.submittedAt.seconds * 1000).toLocaleString('ko-KR') : '알 수 없음');

              return (
                <div key={app.id} className="bg-white p-6 border-2 border-order-text shadow-[4px_4px_0_#2c2c2c] relative">
                  {/* 상단 뱃지 & 액션 */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-block bg-order-yellow text-order-text font-black px-3 py-1 border-2 border-order-text text-sm">
                      #{applications.length - index}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDelete(app.id, app.name)}
                        title="지원서 삭제"
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 기본 정보 컬럼 */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-black flex items-center gap-2">
                          {app.name}
                          <span className={`text-xs px-2 py-0.5 rounded font-bold border ${
                            app.gender === '남성' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-pink-100 text-pink-700 border-pink-300'
                          }`}>
                            {app.gender || '미입력'}
                          </span>
                          <span className="text-sm text-gray-500 font-normal">({app.age}세)</span>
                        </div>
                      </div>

                      {/* 전화번호 (복사 + 전화 걸기) */}
                      <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 border border-dashed border-gray-300">
                        <Phone size={15} className="text-order-red shrink-0" />
                        <a href={`tel:${app.phone}`} className="font-mono font-bold hover:underline text-gray-800">
                          {app.phone || '연락처 없음'}
                        </a>
                        {app.phone && (
                          <button 
                            onClick={() => copyPhoneNumber(app.phone, app.id)}
                            className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-order-text px-2 py-1 bg-white border border-gray-300"
                            title="전화번호 복사"
                          >
                            {copiedId === app.id ? (
                              <><Check size={12} className="text-green-600" /> 복사됨</>
                            ) : (
                              <><Copy size={12} /> 복사</>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="text-sm text-gray-700">
                        <strong>학교/소속:</strong> {app.school || '미입력'}
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>활동 지역:</strong> {app.location || '미입력'}
                      </div>
                      
                      <div className="pt-2 border-t border-gray-100 space-y-1.5 text-sm">
                        <div>
                          <strong>최애 음식:</strong>{' '}
                          {Array.isArray(app.favoriteFood) ? app.favoriteFood.join(', ') : (app.favoriteFood || '-')}
                        </div>
                        <div><strong>맛집 스타일:</strong> {app.restaurantStyle || '-'}</div>
                        <div><strong>지금 당장 먹고싶은 것:</strong> {app.oneMenu || '-'}</div>
                      </div>
                    </div>

                    {/* 활동 희망 및 지원 사유 컬럼 */}
                    <div className="flex flex-col justify-between">
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>원하는 활동:</strong>{' '}
                          {Array.isArray(app.activities) ? app.activities.join(', ') : (app.activities || '-')}
                        </div>
                        <div><strong>사교 스타일:</strong> {app.socialStyle || '-'}</div>
                        
                        <div className="mt-3 bg-[#fdfbf7] p-3 border-2 border-dashed border-order-line">
                          <strong className="text-xs text-gray-600 block mb-1">지원 이유 및 기대하는 점:</strong>
                          <p className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans">
                            {app.reason || '(작성 내용 없음)'}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <span>제출일시:</span>
                        <span className="font-mono">{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredApplications.length === 0 && !loading && (
              <div className="text-center py-20 bg-white border-2 border-order-text shadow-[4px_4px_0_#2c2c2c] text-gray-500 font-bold">
                {searchTerm || genderFilter !== 'all' 
                  ? '검색 조건에 맞는 지원서가 없습니다.' 
                  : '아직 접수된 지원서가 없습니다.'}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
