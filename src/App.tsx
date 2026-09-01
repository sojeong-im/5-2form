import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowLeft, MapPin } from 'lucide-react'

function App() {
  const [view, setView] = useState<'landing' | 'gallery' | 'form'>('landing');

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    school: '',
    location: '',
    phone: '',
    favoriteFood: [] as string[],
    restaurantStyle: '',
    oneMenu: '',
    activities: [] as string[],
    socialStyle: '',
    reason: '',
    agreePeriod: false,
    agreeCost: false,
    agreeRules: false,
    agreeManners: false,
    agreeAll: false,
  });

  const toggleArrayItem = (field: 'favoriteFood' | 'activities', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) }
      } else {
        return { ...prev, [field]: [...current, value] }
      }
    })
  }

  const RadioItem = ({ label, field, value }: { label: string, field: keyof typeof formData, value: string }) => {
    const isChecked = formData[field] === value;
    return (
      <div 
        className="flex items-start gap-3 cursor-pointer group mb-3"
        onClick={() => setFormData(prev => ({ ...prev, [field]: value }))}
      >
        <div className={`checkbox-custom ${isChecked ? 'checked' : ''}`}>
          {isChecked && <Check size={16} strokeWidth={3} />}
        </div>
        <span className={`text-base flex-1 ${isChecked ? 'font-bold' : ''}`}>{label}</span>
      </div>
    )
  }

  const CheckItem = ({ label, field, value }: { label: string, field: 'favoriteFood' | 'activities', value: string }) => {
    const isChecked = formData[field].includes(value);
    return (
      <div 
        className="flex items-start gap-3 cursor-pointer group mb-3 w-full sm:w-1/2"
        onClick={() => toggleArrayItem(field, value)}
      >
        <div className={`checkbox-custom ${isChecked ? 'checked' : ''}`}>
          {isChecked && <Check size={16} strokeWidth={3} />}
        </div>
        <span className={`text-base flex-1 ${isChecked ? 'font-bold' : ''}`}>{label}</span>
      </div>
    )
  }

  const ConsentItem = ({ label, field, description }: { label: string, field: keyof typeof formData, description?: string }) => {
    const isChecked = formData[field] as boolean;
    return (
      <div 
        className="flex items-start gap-3 cursor-pointer group mb-4"
        onClick={() => setFormData(prev => ({ ...prev, [field]: !prev[field] }))}
      >
        <div className={`checkbox-custom ${isChecked ? 'checked' : ''} mt-1`}>
          {isChecked && <Check size={16} strokeWidth={3} />}
        </div>
        <div className="flex-1">
          <p className={`text-base ${isChecked ? 'font-bold' : ''}`}>{label}</p>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e5e5e5] bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] selection:bg-order-red selection:text-white overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* LANDING VIEW */}
        {view === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-order-text drop-shadow-sm">한끼합쇼</h1>
              <p className="text-xl md:text-2xl font-bold text-gray-600">6기 신입 멤버 모집</p>
            </div>
            
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button 
                onClick={() => setView('form')}
                className="bg-order-red text-white text-xl font-black py-4 px-8 shadow-[4px_4px_0_#2c2c2c] hover:shadow-[2px_2px_0_#2c2c2c] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
              >
                바로 지원하기
              </button>
              <button 
                onClick={() => setView('gallery')}
                className="bg-white border-2 border-order-text text-order-text text-xl font-bold py-4 px-8 shadow-[4px_4px_0_#2c2c2c] hover:shadow-[2px_2px_0_#2c2c2c] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
              >
                이전 기수 사진 보기
              </button>
            </div>
          </motion.div>
        )}

        {/* GALLERY VIEW */}
        {view === 'gallery' && (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen max-w-3xl mx-auto py-10 px-4 md:px-8"
          >
            <button 
              onClick={() => setView('landing')}
              className="flex items-center gap-2 font-bold mb-8 hover:text-order-red transition-colors"
            >
              <ArrowLeft size={20} /> 돌아가기
            </button>
            
            <h2 className="text-3xl font-black mb-8">우리들의 맛있는 추억들</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-12">
              <img src="/images/photo1.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo2.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo3.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg col-span-2" />
              <img src="/images/photo4.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo5.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo6.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg col-span-2" />
              <img src="/images/photo7.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo8.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo9.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg col-span-2" />
              <img src="/images/photo10.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg col-span-2" />
              <img src="/images/photo11.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo12.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo13.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg col-span-2" />
              <img src="/images/photo14.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo15.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo16.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg col-span-2" />
              <img src="/images/photo17.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo18.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
              <img src="/images/photo19.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg col-span-2" />
              <img src="/images/photo20.jpg" alt="한끼합쇼 추억" className="w-full h-48 md:h-64 object-cover border-4 border-white shadow-lg" />
            </div>

            {/* Bragging section */}
            <div className="bg-white border-4 border-order-text p-6 md:p-8 mb-12 relative shadow-[8px_8px_0_#2c2c2c]">
              <div className="absolute -top-5 -left-5 bg-order-red text-white font-black px-4 py-2 rotate-[-5deg] border-2 border-order-text">
                한끼합쇼만의 특별함!
              </div>
              <div className="mt-4 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                    <MapPin className="text-order-red" /> 네이버지도 하트 컬렉터 운영진
                  </h3>
                  <p className="text-lg leading-relaxed">
                    어디 갈지 고민하지 마세요. 운영진들의 네이버지도에는 이미 <strong>수백 개의 찐 맛집 하트</strong>가 저장되어 있습니다.<br/>
                    광고 없는 진짜 맛집, 분위기 좋은 숨은 핫플만 골라서 여러분을 안내합니다. 실패 없는 미식 탐험을 보장합니다!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pb-20">
              <button 
                onClick={() => setView('form')}
                className="bg-order-red text-white text-2xl font-black py-4 px-12 shadow-[4px_4px_0_#2c2c2c] hover:shadow-[2px_2px_0_#2c2c2c] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
              >
                나도 함께하기 (지원 폼으로)
              </button>
            </div>
          </motion.div>
        )}

        {/* FORM VIEW */}
        {view === 'form' && (
          <motion.div 
            key="form"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-2xl bg-order-bg shadow-2xl relative mx-auto my-10"
            style={{
              boxShadow: '20px 20px 60px #c3c3c3, -20px -20px 60px #ffffff',
            }}
          >
            {/* Receipt zig-zag top */}
            <div className="h-4 w-full" style={{ backgroundImage: 'radial-gradient(circle at 10px 0, transparent 10px, #f8f4e6 11px)', backgroundSize: '20px 20px', backgroundPosition: '-10px -10px', backgroundRepeat: 'repeat-x', marginTop: '-10px' }}></div>

            <div className="p-8 md:p-12">
              <button 
                onClick={() => setView('landing')}
                className="flex items-center gap-2 font-bold mb-8 hover:text-order-red transition-colors text-sm"
              >
                <ArrowLeft size={16} /> 처음으로
              </button>

              {/* Header */}
              <div className="text-center mb-10 border-b-4 border-double border-order-line pb-6">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">한끼합쇼 6기</h1>
                <h2 className="text-2xl font-bold tracking-widest bg-order-text text-white inline-block px-4 py-1">주 문 서</h2>
                
                <div className="flex justify-between items-end mt-8 text-sm md:text-base font-bold font-mono">
                  <div>Table No. <span className="border-b-2 border-black inline-block w-12 text-center text-red-600">6</span></div>
                  <div>Date: <span className="border-b-2 border-black inline-block w-24 text-center">26.09.01</span></div>
                  <div>Guests: <span className="border-b-2 border-black inline-block w-12 text-center">1</span></div>
                </div>
              </div>

              {/* Form Content */}
              <div className="space-y-12">
                
                {/* 1 & 2 & 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-bold text-lg mb-2">1. 이름</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-lg mb-2">2. 나이</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="23세"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-lg mb-4">3. 성별</label>
                  <div className="flex gap-8">
                    <RadioItem label="남성" field="gender" value="남성" />
                    <RadioItem label="여성" field="gender" value="여성" />
                  </div>
                </div>

                <div className="dashed-line my-8 w-full"></div>

                {/* 4 & 5 & 6 */}
                <div>
                  <label className="block font-bold text-lg mb-2">4. 학교 / 학과 / 학년</label>
                  <p className="text-sm text-gray-500 mb-2">예) 한끼대학교 / 맛집탐방학과 / 3학년</p>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.school}
                    onChange={e => setFormData({...formData, school: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block font-bold text-lg mb-2">5. 주 활동 지역 (거주지)</label>
                  <p className="text-sm text-gray-500 mb-2">예) 신촌, 성수, 수원 등</p>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block font-bold text-lg mb-2">6. 연락처</label>
                  <input 
                    type="tel" 
                    className="input-field" 
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="dashed-line my-8 w-full"></div>

                {/* 7 */}
                <div>
                  <label className="block font-bold text-lg mb-4">7. 평소 어떤 음식을 가장 좋아하세요? <span className="text-sm font-normal text-gray-500">(복수 선택)</span></label>
                  <div className="flex flex-wrap">
                    <CheckItem label="한식" field="favoriteFood" value="한식" />
                    <CheckItem label="양식" field="favoriteFood" value="양식" />
                    <CheckItem label="일식" field="favoriteFood" value="일식" />
                    <CheckItem label="중식" field="favoriteFood" value="중식" />
                    <CheckItem label="매운 음식" field="favoriteFood" value="매운 음식" />
                    <CheckItem label="고기" field="favoriteFood" value="고기" />
                    <CheckItem label="디저트" field="favoriteFood" value="디저트" />
                    <CheckItem label="카페 / 베이커리" field="favoriteFood" value="카페 / 베이커리" />
                    <CheckItem label="이색적인 해외 음식" field="favoriteFood" value="이색적인 해외 음식" />
                    <CheckItem label="딱히 안 가려요! 맛있으면 다 좋아요" field="favoriteFood" value="딱히 안 가려요" />
                  </div>
                </div>

                <div className="dashed-line my-8 w-full"></div>

                {/* 8 */}
                <div>
                  <label className="block font-bold text-lg mb-4">8. 맛집을 고를 때 나는 어떤 타입인가요?</label>
                  <div className="space-y-2">
                    <RadioItem label="후기까지 꼼꼼하게 찾아보고 가는 편" field="restaurantStyle" value="꼼꼼" />
                    <RadioItem label="SNS에 저장해뒀다가 하나씩 가는 편" field="restaurantStyle" value="SNS저장" />
                    <RadioItem label="지나가다 맛있어 보이면 들어가는 편" field="restaurantStyle" value="직흥" />
                    <RadioItem label="같이 가는 사람이 고르는 곳도 잘 가는 편" field="restaurantStyle" value="동조" />
                    <RadioItem label="마음에 드는 맛집을 계속 가는 편" field="restaurantStyle" value="단골" />
                  </div>
                </div>

                <div className="dashed-line my-8 w-full"></div>

                {/* 9 */}
                <div>
                  <label className="block font-bold text-lg mb-2">9. 지금 딱 하나 먹으러 갈 수 있다면?</label>
                  <p className="text-sm text-gray-500 mb-2">지역 + 메뉴를 같이 적어주세요! (예: 을지로 냉면 / 성수 파스타)</p>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.oneMenu}
                    onChange={e => setFormData({...formData, oneMenu: e.target.value})}
                  />
                </div>

                <div className="dashed-line my-8 w-full"></div>

                {/* 10 */}
                <div>
                  <label className="block font-bold text-lg mb-4">10. 한끼합쇼에서 가장 해보고 싶은 활동은? <span className="text-sm font-normal text-gray-500">(복수 선택)</span></label>
                  <div className="space-y-2">
                    <CheckItem label="골목 노포 찾아가기" field="activities" value="노포" />
                    <CheckItem label="요즘 뜨는 핫플 맛집 가보기" field="activities" value="핫플" />
                    <CheckItem label="카페 투어" field="activities" value="카페" />
                    <CheckItem label="디저트 맛집 도장깨기" field="activities" value="디저트" />
                    <CheckItem label="맛집 + 동네 산책" field="activities" value="산책" />
                    <CheckItem label="한강 치맥" field="activities" value="치맥" />
                    <CheckItem label="안 가본 서울 동네 탐방" field="activities" value="탐방" />
                    <CheckItem label="멤버 추천 맛집 랜덤으로 가보기" field="activities" value="랜덤" />
                  </div>
                </div>

                <div className="dashed-line my-8 w-full"></div>

                {/* 11 */}
                <div>
                  <label className="block font-bold text-lg mb-4">11. 새로운 사람들이랑 맛집을 가게 됐다면 나는 어떤 편인가요?</label>
                  <div className="space-y-2">
                    <RadioItem label="먼저 말 걸면서 금방 친해지는 편" field="socialStyle" value="외향" />
                    <RadioItem label="처음엔 어색하지만 금방 친해지는 편" field="socialStyle" value="적응" />
                    <RadioItem label="누가 말 걸어주면 편하게 이야기하는 편" field="socialStyle" value="수용" />
                    <RadioItem label="친해지는 데 시간이 조금 필요한 편" field="socialStyle" value="신중" />
                  </div>
                </div>

                <div className="dashed-line my-8 w-full"></div>

                {/* 12 */}
                <div>
                  <label className="block font-bold text-lg mb-2">12. 한끼합쇼에 지원하게 된 이유</label>
                  <p className="text-sm text-gray-500 mb-4">맛집을 찾아다니고 싶어서, 새로운 동네를 가보고 싶어서 등 편하게 적어주세요 :)</p>
                  <textarea 
                    className="w-full bg-transparent border-2 border-dashed border-order-line outline-none p-4 font-handwriting text-blue-800 text-lg focus:border-blue-500 resize-none h-32"
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                  ></textarea>
                </div>
                
              </div>

              {/* Footer - Consent & Submit */}
              <div className="mt-16 pt-8 border-t-4 border-double border-order-line">
                <h3 className="font-black text-2xl mb-6 text-center">지원 전 확인해주세요 ✓</h3>
                <div className="bg-white/40 p-6 border-2 border-order-line">
                  <ConsentItem 
                    label="활동 기간을 확인했습니다." 
                    description="2026년 9월부터 2027년 2월까지 활동합니다."
                    field="agreePeriod" 
                  />
                  <ConsentItem 
                    label="활동비 운영 방식을 확인했습니다." 
                    description="별도의 고정 회비 없이 식비·카페 등 활동 당일 발생하는 비용은 참여 인원끼리 1/N로 정산합니다."
                    field="agreeCost" 
                  />
                  <ConsentItem 
                    label="정치·종교·상업 및 기타 불건전한 목적의 참여는 제한될 수 있음을 확인했습니다." 
                    field="agreeRules" 
                  />
                  <ConsentItem 
                    label="다른 멤버에게 불편을 주는 행동이 확인될 경우 활동이 제한될 수 있음을 확인했습니다." 
                    field="agreeManners" 
                  />
                  
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-order-line">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => {
                        const newValue = !formData.agreeAll;
                        setFormData(prev => ({
                          ...prev,
                          agreeAll: newValue,
                          agreePeriod: newValue,
                          agreeCost: newValue,
                          agreeRules: newValue,
                          agreeManners: newValue
                        }))
                      }}
                    >
                      <div className={`checkbox-custom ${formData.agreeAll ? 'checked' : ''} w-6 h-6 border-4`}>
                        {formData.agreeAll && <Check size={20} strokeWidth={4} />}
                      </div>
                      <span className="font-black text-lg text-order-red">[ 필수 ] 위 내용을 모두 확인했으며 이에 동의합니다.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center">
                  <div className="text-xl font-bold mb-4 font-mono">TOTAL: 열정 가득 1인분</div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-order-red text-white text-2xl font-black py-4 px-12 shadow-[4px_4px_0_#2c2c2c] hover:shadow-[2px_2px_0_#2c2c2c] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                    onClick={() => alert("주문이 접수되었습니다! 한끼합쇼에서 만나요")}
                  >
                    주문하기
                  </motion.button>
                </div>
              </div>

            </div>

            {/* Receipt zig-zag bottom */}
            <div className="h-4 w-full absolute bottom-[-10px] left-0" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, transparent 10px, #f8f4e6 11px)', backgroundSize: '20px 20px', backgroundPosition: '-10px 0px', backgroundRepeat: 'repeat-x' }}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
