import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. 상태(State) 만들기
  const [clicks, setClicks] = useState(0);       // 클릭 횟수
  const [timeLeft, setTimeLeft] = useState(10);  // 남은 시간 (10초)
  const [isPlaying, setIsPlaying] = useState(false); // 게임 진행 중 여부

  // 2. 타이머 동작 (useEffect)
  useEffect(() => {
    let timer: number;
    // 게임이 진행 중이고 시간이 0보다 클 때만 1초마다 시간 감소
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false); // 시간이 0이 되면 게임 종료
    }
    
    // 화면이 꺼지거나 타이머가 불필요해질 때 타이머 청소(정리)
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // 3. 시작 버튼 눌렀을 때 실행될 함수
  const startGame = () => {
    setClicks(0);
    setTimeLeft(10);
    setIsPlaying(true);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>저그(Zerg) 피지컬 훈련: APM 측정기</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>남은 시간: {timeLeft}초</p>
      <h3>현재 클릭 수: {clicks}</h3>
      
      {/* 대기 상태: 시작 버튼 보여주기 */}
      {!isPlaying && timeLeft === 10 && (
        <button onClick={startGame} style={{ padding: '10px 20px', fontSize: '18px' }}>
          측정 시작
        </button>
      )}
      
      {/* 진행 상태: 폭풍 클릭 버튼 보여주기 */}
      {isPlaying && (
        <button 
          onClick={() => setClicks((prev) => prev + 1)}
          style={{ padding: '30px 60px', fontSize: '24px', backgroundColor: '#8a2be2', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
        >
          폭풍 클릭!!
        </button>
      )}

      {/* 종료 상태: 결과 보여주기 */}
      {!isPlaying && timeLeft === 0 && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
          <h3>🔥 측정 종료! 🔥</h3>
          <p>초당 클릭(CPS): {clicks / 10}</p>
          <p style={{ color: 'red', fontWeight: 'bold' }}>예상 APM: {(clicks / 10) * 60}</p>
          <button onClick={startGame} style={{ marginTop: '10px' }}>다시 하기</button>
        </div>
      )}
    </div>
  );
}

export default App;