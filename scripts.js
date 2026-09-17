// 상태 상수 및 변수
const WORK_TIME = 25 * 60; // 25분 (초 단위)
const BREAK_TIME = 5 * 60; // 5분 (초 단위)

let timeLeft = WORK_TIME;
let isWorking = true;
let timerId = null;

// DOM 요소 선택
const timerEl = document.getElementById("timer");
const modeEl = document.getElementById("mode");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const modeBtn = document.getElementById("mode-btn");

// 화면 시간 표시 함수 (초 -> MM:SS 포맷)
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // 두 자리수로 패딩 (예: 5초 -> 05)
  timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 타이머 시작/일시정지 토글
function toggleTimer() {
  if (timerId !== null) {
    // 일시정지 로직
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = "시작";
  } else {
    // 시작 로직
    startBtn.textContent = "일시정지";
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        // 시간이 다 되었을 때 모드 자동 전환
        clearInterval(timerId);
        timerId = null;
        switchMode();
        alert(isWorking ? "휴식 끝! 다시 집중할 시간입니다." : "집중 완료! 5분간 휴식하세요.");
      }
    }, 1000);
  }
}

// 모드 전환 (집중 <-> 휴식)
function switchMode() {
  clearInterval(timerId);
  timerId = null;
  startBtn.textContent = "시작";

  isWorking = !isWorking;
  modeEl.textContent = isWorking ? "집중 시간" : "휴식 시간";
  timeLeft = isWorking ? WORK_TIME : BREAK_TIME;
  updateDisplay();
}

// 초기화
function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  startBtn.textContent = "시작";
  timeLeft = isWorking ? WORK_TIME : BREAK_TIME;
  updateDisplay();
}

// 이벤트 리스너 등록
startBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
modeBtn.addEventListener("click", switchMode);

// 최초 렌더링
updateDisplay();