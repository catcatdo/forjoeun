const STORAGE_KEY = 'forjoeun_chat_v3';
const SAVE_NOTES_KEY = 'forjoeun_saved_status_v3';
const AI_ENDPOINT = '/api/reply';
const USE_AI = false; // true: Codex 브리지 사용, false: 기존 스크립트 룰 사용

const AFFINITY_MAX = 140;

const affinityStages = [
  { min: 0, max: 8, status: '요즘은 훈련 루틴이 먼저야. 근데 네가 챙겨주니까 안정감이 있어.', img: 'assets/profile/stage1.png' },
  { min: 9, max: 18, status: '너무 과하지 않게 물어봐줘서 고맙다. 오늘도 집중이 잘 됐다.', img: 'assets/profile/stage2.png' },
  { min: 19, max: 32, status: '짧은 메시지였는데 마음이 정돈된다. 좋은 신호야.', img: 'assets/profile/stage3.png' },
  { min: 33, max: 48, status: '네가 있으면 대화가 길어져도 부담스럽지 않다.', img: 'assets/profile/stage4.png' },
  { min: 49, max: 68, status: '오늘은 네 덕분에 일정 관리도 차분해졌어.', img: 'assets/profile/stage5.png' },
  { min: 69, max: 88, status: '상대방이 나를 기다려줬다는 느낌이 들면 고맙다.', img: 'assets/profile/stage6.png' },
  { min: 89, max: 140, status: '너와의 톤이 제일 편하다. 이런 날이 오래오래 가면 좋겠다.', img: 'assets/profile/stage7.png' },
];

const scenes = {
  start: {
    speaker: 'hero',
    text: '채은성: 오늘도 훈련 끝났어. 목소리만 들어도 오늘 컨디션이 정리될 것 같아.',
    choices: [
      { label: '수고했어. 오늘은 많이 버텼으니 잘 쉬어', gain: 8, next: 'care1' },
      { label: '너무 조급해하지 말고 호흡부터 잡아', gain: 6, next: 'care2' },
      { label: '기분 좋으면 통화라도 할까?', gain: 7, next: 'care3' }
    ]
  },
  care1: {
    speaker: 'me', text: '오늘도 버텼다니 멋있다, 이 말로 끝내고 싶어.',
    nextHeroLine: '채은성: 나한테는 이런 말이 가장 정확한 응원 같아. 과장 없이 고마워.',
    choices: [
      { label: '응원 메시지 기록해둘게, 다시 보내도 괜찮지?', gain: 9, next: 'more1' },
      { label: '너한테 잘 맞는 루틴 루프 정리해줄까?', gain: 7, next: 'more2' },
      { label: '난 네 편이야. 오늘은 일찍 자', gain: 6, next: 'more3' }
    ]
  },
  care2: {
    speaker: 'me', text: '지금은 속도를 줄여야 할 타이밍 같아. 오늘은 진짜 많이 달릴 필요 없어.',
    nextHeroLine: '채은성: 단호한 말투가 좋아. 오히려 그게 나한테는 편한 편이야.',
    choices: [
      { label: '좋아, 오늘은 기록만 정리해', gain: 8, next: 'more3' },
      { label: '네가 제일 먼저 쉬는 날은 뭐가 좋을까?', gain: 9, next: 'more2' },
      { label: '아무 말 말고 충분히 쉬어', gain: 6, next: 'more1' }
    ]
  },
  care3: {
    speaker: 'me', text: '통화도 좋고 글도 좋아. 편할 때 연락해.',
    nextHeroLine: '채은성: 그래, 과하게 기대하지 않고 오늘은 이렇게만 끝내자.',
    choices: [
      { label: '통화는 네가 힘이 나는 날에 하자', gain: 9, next: 'more2' },
      { label: '그렇구나, 내가 스케줄 알람 맞춰둘게', gain: 10, next: 'more1' },
      { label: '너는 너무 열심히 하지? 천천히 가자', gain: 8, next: 'more3' }
    ]
  },
  more1: {
    speaker: 'hero', text: '채은성: 좋은 조언이야. 네가 말해주면 오히려 덜 흔들린다.',
    choices: [
      { label: '기록 보면서 조절하면 돼', gain: 8, next: 'end1' },
      { label: '다음 주는 컨디션 우선으로', gain: 9, next: 'end2' },
      { label: '약속은 작은 것부터, 천천히', gain: 6, next: 'end3' }
    ]
  },
  more2: {
    speaker: 'hero', text: '채은성: 루틴을 묶는 건 네 스타일이 잘 맞는다. 안정적인 장단이 좋네.',
    choices: [
      { label: '그럼 내가 다음 루틴 체크표 만들어줄게', gain: 10, next: 'end2' },
      { label: '너무 부담되면 취소해도 돼', gain: 8, next: 'end3' },
      { label: '짧게라도 계속 체크할래', gain: 7, next: 'end1' }
    ]
  },
  more3: {
    speaker: 'hero', text: '채은성: 무리하면 안 돼. 이게 오래 가는 방식이니까.',
    choices: [
      { label: '네 스케줄 기준으로 내가 맞춰볼게', gain: 9, next: 'end1' },
      { label: '내일 아침 리마인드 보낼게', gain: 8, next: 'end2' },
      { label: '오늘은 정말 일찍 자', gain: 10, next: 'end3' }
    ]
  },
  end1: { speaker: 'hero', text: '채은성: 오늘 말한 걸 잊지 않을게. 다음엔 더 잘 정리해서 이야기하자.', choices: [{ label: '다음 대화로', gain: 3, next: 'start' }], end: true },
  end2: { speaker: 'hero', text: '채은성: 루틴은 천천히 쌓는 게 이긴다. 너 덕분에 덜 흔들린다.', choices: [{ label: '오늘은 여기까지', gain: 4, next: 'start' }], end: true },
  end3: { speaker: 'hero', text: '채은성: 네가 먼저 지치지 않게 챙겨줬다. 그게 제일 큼.', choices: [{ label: '좋은 밤', gain: 4, next: 'start' }], end: true }
};

const el = {
  frame: document.getElementById('chatFrame'),
  choices: document.getElementById('choices'),
  status: document.getElementById('heroStatus'),
  avatar: document.getElementById('heroAvatar'),
  heart: document.getElementById('heartText'),
  profileBtn: document.getElementById('profileBtn'),
};

const state = {
  scene: 'start',
  affinity: 0,
  history: [],
  profileClicks: 0,
  aiMode: false,
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function stageForAffinity(a) {
  return affinityStages.find((s) => a >= s.min && a <= s.max) || affinityStages[affinityStages.length - 1];
}

function renderStatus() {
  const stage = stageForAffinity(state.affinity);
  el.status.textContent = stage.status;
  el.heart.textContent = String(state.affinity);
  el.avatar.src = stage.img;
  el.avatar.onerror = () => {
    el.avatar.style.display = 'none';
  };
}

function bubble(side, text, name) {
  const row = document.createElement('div');
  row.className = `msg ${side}`;
  const b = document.createElement('div');
  b.className = 'bubble';

  if (side === 'hero' && name) {
    const label = document.createElement('span');
    label.className = 'name-label';
    label.textContent = '채은성';
    b.appendChild(label);
  }

  b.appendChild(document.createTextNode(text));
  row.appendChild(b);
  el.frame.appendChild(row);
  el.frame.scrollTop = el.frame.scrollHeight;
}

function clearChoices() {
  el.choices.innerHTML = '';
}

function appendHistory(who, text) {
  state.history.push({ who, text, at: Date.now() });
  if (state.history.length > 200) state.history = state.history.slice(-200);
}

function drawChoices(scene) {
  clearChoices();

  (scene.choices || []).forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = choice.label;
    btn.onclick = async () => {
      await applyChoice(choice, scene);
    };
    el.choices.appendChild(btn);
  });
}

async function callAI(choice, currentScene, nextFallback) {
  const payload = {
    userChoiceLabel: choice.label,
    scene: currentScene,
    affinity: state.affinity,
    nextFallback,
    recentHistory: state.history.slice(-8)
  };

  try {
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== 'object') return null;
    if (!data.heroText || !data.nextScene) return null;
    return {
      heroText: data.heroText,
      affinityDelta: Number(data.affinityDelta) || 0,
      nextScene: data.nextScene || nextFallback,
      status: data.status || null,
    };
  } catch {
    return null;
  }
}

async function applyChoice(choice, sceneObj) {
  state.affinity = clamp(state.affinity + choice.gain, 0, AFFINITY_MAX);
  appendHistory('me', choice.label);
  bubble('me', choice.label);

  const nextDefault = scenes[choice.next] || scenes.start;
  let heroLine = sceneObj.nextHeroLine || nextDefault.text;
  let delta = 0;
  let nextSceneId = choice.next;

  if (state.aiMode) {
    const aiResult = await callAI(choice, state.scene, choice.next);
    if (aiResult) {
      heroLine = aiResult.heroText;
      delta = aiResult.affinityDelta;
      nextSceneId = aiResult.nextScene in scenes ? aiResult.nextScene : choice.next;
      if (aiResult.status) {
        const st = affinityStages.find((x) => aiResult.nextScene || (x.min <= state.affinity + delta && x.max >= state.affinity + delta));
        if (st && st.status) {
          // optional immediate notice only when ai gives status
        }
      }
    }
  }

  if (!heroLine) heroLine = nextDefault.text;

  state.affinity = clamp(state.affinity + delta, 0, AFFINITY_MAX);
  if (!state.aiMode && delta === 0 && sceneObj.nextHeroLine) {
    heroLine = sceneObj.nextHeroLine;
  }

  bubble('hero', heroLine, true);
  appendHistory('hero', heroLine);

  const nextScene = scenes[nextSceneId] || scenes.start;

  // if scene itself has additional line
  if (!state.aiMode && sceneObj.nextHeroLine && nextDefault && nextDefault.text === scenes[state.scene]?.nextHeroLine) {
    // no-op for legacy
  }

  renderStatus();
  state.scene = nextSceneId;

  // render next choices
  if (nextScene.end) {
    nextScene.choices.forEach(() => {});
  }
  drawChoices(nextScene);
  saveState();
}

function renderScene(sceneId, fromHistory = false) {
  const scene = scenes[sceneId] || scenes.start;
  state.scene = sceneId;

  if (fromHistory) return drawChoices(scene);

  bubble('hero', scene.text, true);
  appendHistory('hero', scene.text);

  drawChoices(scene);

  if (scene.nextHeroLine) {
    setTimeout(() => {
      bubble('hero', scene.nextHeroLine, true);
      appendHistory('hero', scene.nextHeroLine);
      renderStatus();
      saveState(false);
    }, 240);
  }

  renderStatus();
}

function saveState(notify = false) {
  const data = {
    scene: state.scene,
    affinity: state.affinity,
    history: state.history,
    profileClicks: state.profileClicks,
    aiMode: state.aiMode,
    updated: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (notify) localStorage.setItem(SAVE_NOTES_KEY, `saved@${new Date().toISOString()}`);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed) return false;
    state.scene = parsed.scene || 'start';
    state.affinity = clamp(Number(parsed.affinity) || 0, 0, AFFINITY_MAX);
    state.profileClicks = Number(parsed.profileClicks) || 0;
    state.history = Array.isArray(parsed.history) ? parsed.history : [];
    state.aiMode = Boolean(parsed.aiMode);
    return true;
  } catch {
    return false;
  }
}

function hydrateFromHistory() {
  clearChoices();
  el.frame.innerHTML = '';

  state.history.forEach((h) => {
    bubble(h.who === 'me' ? 'me' : 'hero', h.text, h.who !== 'me');
  });

  drawChoices(scenes[state.scene] || scenes.start);
  renderStatus();
}

el.profileBtn.addEventListener('click', () => {
  state.profileClicks += 1;
  state.affinity = clamp(state.affinity + 1, 0, AFFINITY_MAX);
  const stage = stageForAffinity(state.affinity);

  appendHistory('hero', stage.status);
  bubble('hero', stage.status, true);

  if (state.profileClicks % 2 === 0) {
    const extra = '상태를 눌렀더니 오늘 분위기가 한결 정리됐다.';
    appendHistory('hero', extra);
    bubble('hero', extra, true);
  }

  renderStatus();
  saveState(false);
});

document.getElementById('saveBtn').addEventListener('click', () => {
  saveState(true);
  alert('세이브 완료.');
});

document.getElementById('loadBtn').addEventListener('click', () => {
  if (loadState()) {
    hydrateFromHistory();
    alert('불러오기 완료.');
  } else {
    alert('불러올 저장이 없어요.');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  state.scene = 'start';
  state.affinity = 0;
  state.history = [];
  state.profileClicks = 0;
  el.frame.innerHTML = '';
  renderScene('start');
  saveState(false);
});

document.getElementById('heartBtn')?.addEventListener('click', async () => {
  const want = prompt('AI 모드(채팅형)로 전환할까요? (yes 입력 시 ON, 아니면 OFF)');
  if (want && want.toLowerCase() === 'yes') {
    state.aiMode = true;
    alert('AI 모드 ON. /api/reply 브리지 연결이 필요해요.');
  } else if (want) {
    state.aiMode = false;
    alert('AI 모드 OFF. 대화 규칙 기반으로 진행할게.');
  }
  renderStatus();
  saveState(false);
});

renderStatus();
if (loadState()) {
  hydrateFromHistory();
} else {
  renderScene('start');
}
