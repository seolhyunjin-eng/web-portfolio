// -----------------------------------------
// 1. 상태 데이터 관리 (State)
// -----------------------------------------
let state = {
  growthPoint: 65,
  clickCount: 0,
  currentStage: 1, // 1: 야돈, 2: 야도란, 3: 야돈킹
  missions: {
    click: 0,
    feed: 0,
    pointsReached: false
  }
};

const pokemonStages = {
  1: {
    name: "야돈",
    emoji: "🌸",
    defaultMessage: "야돈은 오늘도 멍하니 물가를 바라보고 있어요.",
    messages: [
      "야돈은 꼬리로 무엇을 낚고 있는 걸까요? 🎣",
      "야돈은 하품을 늘어지게 했습니다. 하아아암~ 🥱",
      "야돈은 꼬리가 잘려도 아픔을 느끼지 못할 만큼 느긋해요. 🌸",
      "야돈이 당신을 물끄러미 바라봅니다. 아무 생각도 없는 것 같아요. 👀",
      "야돈이 제자리에서 꼬리를 살랑살랑 흔듭니다. 🌊"
    ]
  },
  2: {
    name: "야도란",
    emoji: "🐚",
    defaultMessage: "야돈이 야도란으로 진화했어요! 꼬리에 셀러 껍질(🐚)이 생겼습니다.",
    messages: [
      "야도란의 꼬리를 문 셀러는 떨어지고 싶지 않은가 봐요. 🐚",
      "야도란이 물속을 멍하니 쳐다보고 있습니다. 🌊",
      "꼬리가 물리자 엄청난 아이디어가 떠오를 뻔했지만, 까먹었대요. 💡",
      "야도란이 조금 든든하게 당신 앞을 지켜줍니다. 🛡️",
      "꼬리가 묵직해서 그런지 뒤를 돌아볼 때 아주 천천히 움직여요. 🐢"
    ]
  },
  3: {
    name: "야돈킹",
    emoji: "👑",
    defaultMessage: "최종 진화 성공! 지혜로운 셀러 왕관(👑)을 썼습니다.",
    messages: [
      "야돈킹의 머리 위 셀러는 왕관 역할을 하고 있어요. 👑",
      "야돈킹이 우아한 몸짓으로 지혜로운 지시를 내립니다. 🧠",
      "우주와 생명의 신비에 대해 깊이 고뇌하고 있는 야돈킹입니다. 🌌",
      "하루에 한 번 크게 하품을 할 때마다 엄청난 아이디어가 샘솟습니다. 💡",
      "진정한 현자가 된 야돈킹의 미소는 너무나 자애롭습니다. 👑"
    ]
  }
};

// -----------------------------------------
// 2. DOM 요소 참조
// -----------------------------------------
const speechBubble = document.getElementById("speech-bubble");
const characterBtn = document.getElementById("character-btn");
const pokemonImg = document.getElementById("pokemon-img");
const playground = document.getElementById("particle-container");

const currentStageName = document.getElementById("current-stage-name");
const currentPointsValue = document.getElementById("current-points-value");
const clickCountValue = document.getElementById("click-count-value");

const progressPercentLabel = document.getElementById("progress-percent-label");
const progressBarFill = document.getElementById("progress-bar-fill");

const evoCard1 = document.getElementById("evo-card-1");
const evoCard2 = document.getElementById("evo-card-2");
const evoCard3 = document.getElementById("evo-card-3");

const resetBtn = document.getElementById("reset-btn");
const trainingBtns = document.querySelectorAll(".training-btn");

const evoCelebration = document.getElementById("evo-celebration");
const celebrationTitle = document.getElementById("celebration-title");
const celebrationSubtitle = document.getElementById("celebration-subtitle");
const celebrationCloseBtn = document.getElementById("celebration-close-btn");

// 진화 장식 레이어
const decoShell = document.getElementById("evo-deco-shell");
const decoCrown = document.getElementById("evo-deco-crown");

// 미션 UI
const missionClickItem = document.getElementById("mission-click");
const missionFeedItem = document.getElementById("mission-feed");
const missionPointsItem = document.getElementById("mission-points");

// -----------------------------------------
// 3. UI 업데이트 및 동기화 함수
// -----------------------------------------
function updateUI(triggerEvoEffect = false, previousStage = 1) {
  const currentStageInfo = pokemonStages[state.currentStage];
  
  // 1) 텍스트 및 기본 수치 업데이트
  currentStageName.textContent = currentStageInfo.name;
  currentPointsValue.textContent = `${state.growthPoint} pt`;
  clickCountValue.textContent = `${state.clickCount} 회`;

  // 2) 진화 데코레이션 가시성 처리
  decoShell.style.display = "none";
  decoCrown.style.display = "none";
  pokemonImg.classList.remove("stage3-aura");

  if (state.currentStage === 2) {
    decoShell.style.display = "block"; // 야도란: 꼬리 껍질 노출
  } else if (state.currentStage === 3) {
    decoCrown.style.display = "block"; // 야돈킹: 머리 왕관 노출
    pokemonImg.classList.add("stage3-aura"); // 야돈킹 아우라 오버레이
  }

  // 3) Progress Bar 업데이트
  let percentage = 0;
  if (state.currentStage === 1) {
    percentage = Math.min((state.growthPoint / 100) * 100, 100);
  } else if (state.currentStage === 2) {
    percentage = Math.min(((state.growthPoint - 100) / 100) * 100, 100);
  } else {
    percentage = 100;
  }
  
  const displayPercentage = Math.floor(percentage);
  progressPercentLabel.textContent = `${displayPercentage}%`;
  progressBarFill.style.width = `${displayPercentage}%`;
  progressBarFill.setAttribute("aria-valuenow", displayPercentage);

  // 4) 진화 로드맵 액티브 클래스
  evoCard1.classList.remove("active");
  evoCard2.classList.remove("active");
  evoCard3.classList.remove("active");

  if (state.currentStage === 1) evoCard1.classList.add("active");
  else if (state.currentStage === 2) evoCard2.classList.add("active");
  else if (state.currentStage === 3) evoCard3.classList.add("active");

  // 5) 미션 체크
  updateMissions();

  // 6) 진화 성공 모달창
  if (triggerEvoEffect && state.currentStage > previousStage) {
    showCelebrationModal(pokemonStages[state.currentStage].name);
  }
}

// -----------------------------------------
// 4. 성장 포인트 추가 및 진화 체크
// -----------------------------------------
function addPoints(amount) {
  const previousStage = state.currentStage;
  state.growthPoint += amount;

  if (state.growthPoint >= 200) {
    state.currentStage = 3;
  } else if (state.growthPoint >= 100) {
    state.currentStage = 2;
  } else {
    state.currentStage = 1;
  }

  const isEvolved = state.currentStage > previousStage;
  
  if (isEvolved) {
    speechBubble.textContent = pokemonStages[state.currentStage].defaultMessage;
    updateUI(true, previousStage);
  } else {
    updateUI();
  }
}

// -----------------------------------------
// 5. 말풍선 랜덤 메시지
// -----------------------------------------
function triggerRandomMessage() {
  const stageInfo = pokemonStages[state.currentStage];
  const list = stageInfo.messages;
  const randomIndex = Math.floor(Math.random() * list.length);
  speechBubble.textContent = list[randomIndex];
}

// -----------------------------------------
// 6. 캐릭터 애니메이션 트리거
// -----------------------------------------
function triggerMotion(animationType = "bounce-animation") {
  pokemonImg.classList.remove("bounce-animation", "wiggle-animation");
  void pokemonImg.offsetWidth; // Reflow
  pokemonImg.classList.add(animationType);

  setTimeout(() => {
    pokemonImg.classList.remove(animationType);
  }, 400);
}

// -----------------------------------------
// 7. 클릭 위치 기반 이펙트 파티클 생성
// -----------------------------------------
function createParticle(x, y) {
  const particles = ["🌸", "✨", "💖", "💦", "⭐", "🍬"];
  const randomParticle = particles[Math.floor(Math.random() * particles.length)];
  
  const particle = document.createElement("span");
  particle.className = "click-particle";
  particle.textContent = randomParticle;
  
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  const angle = Math.random() * Math.PI * 2;
  const distance = 40 + Math.random() * 60;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance - 20;
  
  particle.style.setProperty("--tx", `${tx}px`);
  particle.style.setProperty("--ty", `${ty}px`);
  
  playground.appendChild(particle);
  
  particle.addEventListener("animationend", () => {
    particle.remove();
  });
}

// -----------------------------------------
// 8. 무빙 백그라운드 속도 제어
// -----------------------------------------
let speedTimeout;
function setTempBackgroundSpeed(speedString, durationMs) {
  clearTimeout(speedTimeout);
  playground.style.setProperty("--bg-speed", speedString);
  
  speedTimeout = setTimeout(() => {
    playground.style.setProperty("--bg-speed", "20s"); // 기본 속도로 복원
  }, durationMs);
}

// -----------------------------------------
// 9. 3D 패럴랙스 틸트 이벤트 바인딩
// -----------------------------------------
playground.addEventListener("mousemove", (e) => {
  const rect = playground.getBoundingClientRect();
  const x = e.clientX - rect.left; // 상대 좌표 X
  const y = e.clientY - rect.top;  // 상대 좌표 Y
  
  // -15도 ~ 15도 한도 내에서 회전각 계산
  const tiltX = -((y / rect.height) - 0.5) * 30;
  const tiltY = ((x / rect.width) - 0.5) * 30;
  
  playground.style.setProperty("--tilt-x", `${tiltX}deg`);
  playground.style.setProperty("--tilt-y", `${tiltY}deg`);
});

playground.addEventListener("mouseleave", () => {
  // 마우스 아웃 시 원 상태 복구
  playground.style.setProperty("--tilt-x", "0deg");
  playground.style.setProperty("--tilt-y", "0deg");
});

// -----------------------------------------
// 10. 오늘의 미션 체크리스트 관리
// -----------------------------------------
function updateMissions() {
  const clickCountDisplay = missionClickItem.querySelector(".mission-count");
  clickCountDisplay.textContent = Math.min(state.clickCount, 5);
  if (state.clickCount >= 5) {
    missionClickItem.classList.add("completed");
    missionClickItem.querySelector(".mission-checkbox").setAttribute("aria-checked", "true");
  } else {
    missionClickItem.classList.remove("completed");
    missionClickItem.querySelector(".mission-checkbox").setAttribute("aria-checked", "false");
  }

  const feedCountDisplay = missionFeedItem.querySelector(".mission-count");
  feedCountDisplay.textContent = Math.min(state.missions.feed, 1);
  if (state.missions.feed >= 1) {
    missionFeedItem.classList.add("completed");
    missionFeedItem.querySelector(".mission-checkbox").setAttribute("aria-checked", "true");
  } else {
    missionFeedItem.classList.remove("completed");
    missionFeedItem.querySelector(".mission-checkbox").setAttribute("aria-checked", "false");
  }

  const pointsDisplay = missionPointsItem.querySelector(".mission-count");
  pointsDisplay.textContent = Math.min(state.growthPoint, 50);
  if (state.growthPoint >= 50) {
    missionPointsItem.classList.add("completed");
    missionPointsItem.querySelector(".mission-checkbox").setAttribute("aria-checked", "true");
  } else {
    missionPointsItem.classList.remove("completed");
    missionPointsItem.querySelector(".mission-checkbox").setAttribute("aria-checked", "false");
  }
}

// -----------------------------------------
// 11. 진화 성공 모달창 제어
// -----------------------------------------
function showCelebrationModal(pokemonName) {
  celebrationTitle.textContent = "진화 성공!";
  celebrationSubtitle.textContent = `축하합니다! 야돈이 새로운 진화체인 [${pokemonName}]으로 거듭났습니다!`;
  evoCelebration.style.display = "flex";
  evoCelebration.setAttribute("aria-hidden", "false");
}

function closeCelebrationModal() {
  evoCelebration.style.display = "none";
  evoCelebration.setAttribute("aria-hidden", "true");
}

// -----------------------------------------
// 12. 이벤트 리스너 바인딩
// -----------------------------------------
characterBtn.addEventListener("click", (e) => {
  state.clickCount++;
  state.missions.click++;
  
  addPoints(10);
  triggerRandomMessage();
  triggerMotion("bounce-animation");
  
  // 배경 임시 질주 속도 변환 (3초 동안 4s 속도로)
  setTempBackgroundSpeed("4s", 3000);
  
  const rect = characterBtn.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  
  createParticle(offsetX, offsetY);
});

characterBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    state.clickCount++;
    state.missions.click++;
    addPoints(10);
    triggerRandomMessage();
    triggerMotion("bounce-animation");
    setTempBackgroundSpeed("4s", 3000);
    createParticle(160, 160);
  }
});

trainingBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-type");
    
    if (type === "walk") {
      addPoints(10);
      speechBubble.textContent = "야돈이 시원한 물가를 걸으며 한결 튼튼해졌습니다! 🌊";
      triggerMotion("wiggle-animation");
      setTempBackgroundSpeed("3s", 4000); // 4초 동안 더 빠르게 질주
      createParticle(160, 100);
    } else if (type === "feed") {
      state.missions.feed++;
      addPoints(15);
      speechBubble.textContent = "야돈이 달콤한 먹이를 야무지게 오물오물 씹어먹습니다! 🍬";
      triggerMotion("bounce-animation");
      setTempBackgroundSpeed("8s", 2000);
      createParticle(160, 160);
    } else if (type === "nap") {
      addPoints(5);
      speechBubble.textContent = "새근새근... 야돈이 충분히 수면을 취하고 에너지를 보충했습니다. 💤";
      triggerMotion("bounce-animation");
      setTempBackgroundSpeed("80s", 6000); // 수면 중에는 배경이 거의 멈춤
      createParticle(160, 200);
    }
  });
});

celebrationCloseBtn.addEventListener("click", closeCelebrationModal);

resetBtn.addEventListener("click", () => {
  if (confirm("정말로 모든 훈련 기록을 초기화하시겠습니까? 처음 단계부터 다시 키워야 합니다.")) {
    state.growthPoint = 0;
    state.clickCount = 0;
    state.currentStage = 1;
    state.missions.click = 0;
    state.missions.feed = 0;
    speechBubble.textContent = "야돈 트레이닝 센터에 오신 것을 환영합니다! 야돈을 터치해보세요.";
    updateUI();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
});
