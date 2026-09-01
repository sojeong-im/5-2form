import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { db } from './firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

export default function Admin({ onBack }: { onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '00347') {
      setIsAuthenticated(true);
      fetchApplications();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
      setPassword('');
    }
  }

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "applications"), orderBy("submittedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications: ", error);
      alert("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

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
          <h2 className="text-2xl font-black mb-6 text-center">관리자 로그인</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="비밀번호" 
              className="border-2 border-order-line p-3 outline-none focus:border-order-text font-mono"
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
      className="min-h-screen bg-order-bg py-10 px-4 md:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-4 border-order-text pb-4">
          <h2 className="text-3xl font-black">관리자 대시보드 (총 {applications.length}명)</h2>
          <button onClick={onBack} className="flex items-center gap-2 font-bold bg-white border-2 border-order-text px-4 py-2 shadow-[2px_2px_0_#2c2c2c]">
            <ArrowLeft size={16} /> 나가기
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-xl">데이터를 불러오는 중...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app, index) => (
              <div key={app.id} className="bg-white p-6 border-2 border-order-text shadow-[4px_4px_0_#2c2c2c] relative">
                <div className="absolute -top-3 -left-3 bg-order-yellow text-order-text font-black px-3 py-1 border-2 border-order-text">
                  #{applications.length - index}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="text-2xl font-black mb-1">{app.name} <span className="text-base text-gray-500 font-normal">({app.age}, {app.gender})</span></div>
                    <div className="text-gray-700 mb-2">📞 {app.phone}</div>
                    <div className="text-gray-700 mb-4">🏫 {app.school} | 📍 {app.location}</div>
                    
                    <div className="mb-2"><strong>최애 음식:</strong> {app.favoriteFood?.join(', ')}</div>
                    <div className="mb-2"><strong>맛집 타입:</strong> {app.restaurantStyle}</div>
                    <div className="mb-2"><strong>지금 당장:</strong> {app.oneMenu}</div>
                  </div>
                  <div>
                    <div className="mb-2"><strong>원하는 활동:</strong> {app.activities?.join(', ')}</div>
                    <div className="mb-2"><strong>사교 스타일:</strong> {app.socialStyle}</div>
                    <div className="mt-4 bg-gray-50 p-4 border border-dashed border-gray-300">
                      <strong>지원 이유:</strong><br/>
                      <p className="whitespace-pre-wrap mt-1 text-sm">{app.reason}</p>
                    </div>
                    <div className="text-xs text-gray-400 mt-4 text-right">
                      제출 시간: {app.submittedAt?.toDate ? app.submittedAt.toDate().toLocaleString('ko-KR') : '알 수 없음'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {applications.length === 0 && (
              <div className="text-center py-20 text-gray-500 font-bold">
                아직 접수된 지원서가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
