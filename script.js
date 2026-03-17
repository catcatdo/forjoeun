const STORAGE_KEY = 'forjoeun_chat_v2';

const affinityStages = [
  { min: 0, max: 8, status: '지금은 훈련만 집중하는 날, 근데 네 메시지가 의외로 힘이 돼.', img: 'assets/profile/stage1.png' },
  { min: 9, max: 18, status: '요즘 네가 올린 이모지 보면서 웃고 있어. 좋은 하루야.', img: 'assets/profile/stage2.png' },
  { min: 19, max: 32, status: '퇴근 길에도 연락하고 싶은 마음이 생기는 날이 늘었어.', img: 'assets/profile/stage3.png' },
  { min: 33, max: 48, status: '너랑 대화하면 기분이 정리되는 느낌이야. 오늘도 수고했지?', img: 'assets/profile/stage4.png' },
  { min: 49, max: 68, status: '네가 챗해주면 경기 전에 긴장이 덜 풀려. 고마워.', img: 'assets/profile/stage5.png' },
  { min: 69, max: 88, status: '요즘은 매일 네 안부를 먼저 묻고 있어. 덕분에 기분이 좋아.', img: 'assets/profile/stage6.png' },
  { min: 89, max: 120, status: '네가 있으면 마음이 편해. 진짜 소중한 사람이 된 것 같아.', img: 'assets/profile/stage7.png' }
];

const scenes = {
  start: {
    speaker: 'hero',
    text: '채은성: 오늘도 경기 전 훈련 끝났어. 어제부터 목이 좀 말라서, 넌 오늘 어떻게 지냈어?',
    choices: [
      { label: '운동 끝나서 피곤해도 안심해! 네가 있잖아', gain: 8, next: 'care1' },
      { label: '오늘은 조용히만, 네 목소리 듣고 싶어', gain: 6, next: 'care2' },
      { label: '나도 네 얘기 듣고 싶어, 일단 편하게 말해줘', gain: 7, next: 'care3' }
    ]
  },
  care1: {
    speaker: 'me',
    text: '운동 끝났는데도 오늘도 기록은 잘 남겼어? 피곤해도 고생 많아.',
    nextHeroLine: '채은성: 네가 신경 써줘서 고마워. 오늘은 그냥 조용히 쉬고 싶어서 너한테 먼저 메시지 남겨.',
    choices: [
      { label: '그럼 따뜻한 차나 마시자, 나중에 내가 챙겨줄게', gain: 9, next: 'more1' },
      { label: '오늘은 통근길만이라도 같이 산책 가능해?', gain: 7, next: 'more2' },
      { label: '오늘은 잠 잘 자고, 내일은 내가 먼저 응원한다', gain: 6, next: 'more1' }
    ]
  },
  care2: {
    speaker: 'me',
    text: '조용한 날은 네가 말해주는 한마디가 더 귀했을 것 같아. 힘들어도 너무 몰아붙이지 말고.',
    nextHeroLine: '채은성: 맞아, 요즘 체력 관리가 최우선이야. 네 말이 오늘도 도움이 돼.',
    choices: [
      { label: '잠깐만, 나중에 경기 하이라이트 보낼게', gain: 8, next: 'more1' },
      { label: '너는 오늘 푹 쉬어. 내가 먼저 축구(야구) 용어로 응원해줄게', gain: 7, next: 'more3' },
      { label: '진짜 고생했어, 오늘은 일찍 잘거야', gain: 6, next: 'more2' }
    ]
  },
  care3: {
    speaker: 'me',
    text: '나도 네 얘기 들으러 왔어. 어제 팬들이 많이 있었어? 어색한 날은 많았어?',
    nextHeroLine: '채은성: 평소보다 조용했어. 오히려 이렇게 네가 묻는 게 훨씬 편했어.',
    choices: [
      { label: '그럼 오늘은 네 일정을 덜 빡빡하게', gain: 9, next: 'more3' },
      { label: '피곤한 날엔 네가 먼저 쉬면 돼, 난 기다릴게', gain: 10, next: 'more2' },
      { label: '다음엔 같이 맛집 가서 스트레스 풀자', gain: 8, next: 'more1' }
    ]
  },
  more1: {
    speaker: 'hero',
    text: '채은성: 네가 날 이렇게 챙겨주니까 내가 뭘 잘못해도 버텨낼 수 있어. 내일도 너한테 먼저 안부 보낼게.',
    choices: [
      { label: '기다릴게, 네 하루를 응원해', gain: 8, next: 'end1' },
      { label: '운동 전에 간단한 루틴 같이 체크해볼까', gain: 9, next: 'end2' },
      { label: '너무 늦지 말고 꼭 쉬어', gain: 6, next: 'end3' }
    ]
  },
  more2: {
    speaker: 'hero',
    text: '채은성: 네가 이렇게 말해주면 나도 오늘은 안정감이 있어. 같이 있는 느낌이 좋아.',
    choices: [
      { label: '우리 지금처럼 조금씩만 쌓아가자', gain: 10, next: 'end2' },
      { label: '내일 경기 전 응원 메시지로 깨워줄게', gain: 8, next: 'end3' },
      { label: '혹시 오늘은 내가 짧은 노래 추천해도 될까', gain: 9, next: 'end1' }
    ]
  },
  more3: {
    speaker: 'hero',
    text: '채은성: 오늘은 네 말 한마디가 한참 버티게 해줬어. 너와 채팅하는 느낌이 확실히 다르더라.',
    choices: [
      { label: '내일은 훈련 계획이 끝나면 바로 수다', gain: 9, next: 'end2' },
      { label: '내가 오늘도 네 얘기 계속 읽을게', gain: 8, next: 'end3' },
      { label: '너는 최고야. 오늘은 이거 먹어도 돼', gain: 10, next: 'end1' }
    ]
  },
  end1: {
    speaker: 'hero',
    text: '채은성: 오늘 대화 덕분에 기분 좋다. 고마워. 오늘은 얼른 푹 쉬자.',
    choices: [
      { label: '좋은 꿈 꿔, 채은성', gain: 5, next: 'start' }
    ],
    end: true
  },
  end2: {
    speaker: 'hero',
    text: '채은성: 내일도 좋은 하루 보내. 네 메시지가 있으면 난 힘낼 수 있어.',
    choices: [
      { label: '응원할게!', gain: 6, next: 'start' }
    ],
    end: true
  },
  end3: {
    speaker: 'hero',
    text: '채은성: 오늘 채팅이 마음이 편했어. 나중에 또 연락할게.',
    choices: [
      { label: '좋아, 네 응원 보낼게', gain: 4, next: 'start' }
    ],
    end: true
  },
};

const state = {
  scene: 'start',
  affinity: 0,
  history: []
};

const chatFrame = document.getElementById('chatFrame');
const choicesWrap = document.getElementById('choices');
const statusEl = document.getElementById('heroStatus');
const avatarEl = document.getElementById('heroAvatar');
const heartText = document.getElementById('heartText');
const profileBtn = document.getElementById('profileBtn');

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function stageForAffinity(a) {
  return affinityStages.find(s => a >= s.min && a <= s.max) || affinityStages[affinityStages.length - 1];
}

function renderStatus() {
  const stage = stageForAffinity(state.affinity);
  statusEl.textContent = stage.status;
  heartText.textContent = String(state.affinity);
  avatarEl.src = stage.img;
  avatarEl.onerror = () => {
    avatarEl.style.display = 'none';
  };
}

function appendBubble(side, text, withName = false) {
  const row = document.createElement('div');
  row.className = `msg ${side}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  if (side === 'hero' && withName) {
    const label = document.createElement('span');
    label.className = 'name-label';
    label.textContent = '채은성';
    bubble.appendChild(label);
  }

  const txt = document.createElement('span');
  txt.textContent = text.replace(/^채은성:\s?/, '');
  bubble.appendChild(document.createTextNode(side === 'hero' ? txt.textContent : txt.textContent));
  row.appendChild(bubble);
  chatFrame.appendChild(row);
  chatFrame.scrollTop = chatFrame.scrollHeight;
}

function pushHistory(who, text) {
  state.history.push({ who, text, when: Date.now() });
}

function clearChoices() {
  choicesWrap.innerHTML = '';
}

function drawChoices(scene) {
  clearChoices();
  (scene.choices || []).forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = choice.label;
    btn.onclick = () => applyChoice(choice);
    choicesWrap.appendChild(btn);
  });
}

function applyChoice(choice) {
  state.affinity = clamp(state.affinity + choice.gain, 0, 120);
  pushHistory('me', choice.label);
  appendBubble('me', choice.label);

  let nextId = choice.next;
  const nextScene = scenes[nextId];

  setTimeout(() => {
    pushHistory(nextScene.speaker || 'hero', nextScene.text);

    if (nextScene.speaker === 'hero') {
      appendBubble('hero', nextScene.text, true);
    } else {
      appendBubble('me', nextScene.text);
    }

    if (nextScene.nextHeroLine) {
      setTimeout(() => {
        appendBubble('hero', nextScene.nextHeroLine, true);
        drawChoices(nextScene);
      }, 350);
    } else {
      drawChoices(nextScene);
    }

    renderStatus();
    if (nextScene.end) {
      const note = document.createElement('button');
      note.className = 'choice';
      note.textContent = '♥ 기록 보기';
      note.onclick = () => {
        const msg = `현재 호감도 ${state.affinity} / 누적 대화: ${state.history.length}개`;
        alert(msg);
      };
      // keep extra action with end message
      if (!nextScene.choices || !nextScene.choices.length) {
        choicesWrap.appendChild(note);
      }
    }
    state.scene = nextId;
    saveState(false);
  }, 250);
}

function renderScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) return;
  state.scene = sceneId;

  if (scene.speaker === 'hero') {
    appendBubble('hero', scene.text, true);
    pushHistory('hero', scene.text);
  }

  if (scene.nextHeroLine) {
    setTimeout(() => {
      appendBubble('hero', scene.nextHeroLine, true);
      pushHistory('hero', scene.nextHeroLine);
      drawChoices(scene);
    }, 250);
  } else {
    drawChoices(scene);
  }
}

function saveState(notify = true) {
  const payload = {
    scene: state.scene,
    affinity: state.affinity,
    history: state.history.slice(-200)
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  if (notify) {
    // no-op UI toast
  }
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;
    state.scene = parsed.scene || 'start';
    state.affinity = clamp(Number(parsed.affinity) || 0, 0, 120);
    state.history = Array.isArray(parsed.history) ? parsed.history : [];
    return true;
  } catch {
    return false;
  }
}

function hydrateFromHistory() {
  chatFrame.innerHTML = '';
  chatFrame.innerHTML = '';
  clearChoices();
  renderStatus();

  if (!state.history.length) {
    renderScene('start');
    return;
  }

  state.history.forEach((h) => {
    const side = h.who === 'me' ? 'me' : 'hero';
    appendBubble(side, h.text, side === 'hero');
  });

  drawChoices(scenes[state.scene] || scenes.start);
}

// profile click shows a small "current status refresh" feeling
let profileClicks = 0;
profileBtn.addEventListener('click', () => {
  const stage = stageForAffinity(state.affinity);
  const idx = affinityStages.findIndex(s => s.min === stage.min && s.max === stage.max);
  const targetStage = affinityStages[Math.min(affinityStages.length - 1, idx)];
  if (!targetStage) return;
  const bonus = 1;
  state.affinity = clamp(state.affinity + bonus, 0, 120);
  profileClicks += 1;
  appendBubble('hero', `채은성: ${targetStage.status}`);
  pushHistory('hero', targetStage.status);
  renderStatus();
  if (profileClicks % 2 === 0) {
    const msg = '프로필이 은은하게 바뀐 것 같아. 오늘 대화가 쌓일수록 느낌이 더 진해져.';
    appendBubble('hero', msg);
    pushHistory('hero', msg);
  }
  chatFrame.scrollTop = chatFrame.scrollHeight;
  saveState(false);
});

// controls

document.getElementById('saveBtn').addEventListener('click', () => {
  saveState(true);
  alert('세이브 완료!');
});

document.getElementById('loadBtn').addEventListener('click', () => {
  if (loadState()) {
    hydrateFromHistory();
    alert('저장된 대화를 불러왔어.');
  } else {
    alert('불러올 저장 데이터가 없어요.');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  state.scene = 'start';
  state.affinity = 0;
  state.history = [];
  renderStatus();
  chatFrame.innerHTML = '';
  renderScene('start');
  saveState(false);
});

// boot
renderStatus();
const hasSave = loadState();
if (hasSave) hydrateFromHistory();
else renderScene('start');
