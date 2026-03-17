const STORAGE_KEY_PREFIX = 'forjoeun_state_';
const LAST_USER_KEY = 'forjoeun_last_user';
const SAVE_NOTES_KEY = 'forjoeun_saved_status_v3';
const AI_ENDPOINT = '/api/reply';

const AFFINITY_MAX = 140;
const AFFINITY_GAIN_DIVISOR = 3;
const MAX_AFFINITY_GAIN = 2;
const AI_AFFINITY_CLAMP = 3;
const AI_TYPING_DELAY = 900;
const RULE_TYPING_DELAY = 500;

const affinityStages = [
  { min: 0, max: 8, status: '요즘은 훈련 루틴이 먼저야. 근데 네가 챙겨주니까 안정감이 있어.', img: 'assets/profile/stage1.png' },
  { min: 9, max: 18, status: '너무 과하지 않게 물어봐줘서 고맙다. 오늘도 집중이 잘 됐다.', img: 'assets/profile/stage2.png' },
  { min: 19, max: 32, status: '짧은 메시지였는데 마음이 정돈된다. 좋은 신호야.', img: 'assets/profile/stage3.png' },
  { min: 33, max: 48, status: '네가 있으면 대화가 길어져도 부담스럽지 않다.', img: 'assets/profile/stage4.png' },
  { min: 49, max: 68, status: '오늘은 네 덕분에 일정 관리도 차분해졌어.', img: 'assets/profile/stage5.png' },
  { min: 69, max: 88, status: '상대가 나를 기다려줬다는 느낌이 들면 고맙다.', img: 'assets/profile/stage6.png' },
  { min: 89, max: 140, status: '너와의 톤이 제일 편하다. 이런 날이 오래오래 가면 좋겠다.', img: 'assets/profile/stage7.png' },
];

const scenes = {
  start: {
    text: '채은성: 오늘도 훈련 끝났어. 목소리만 들어도 오늘 컨디션이 정리될 것 같아.',
    choices: [
      { label: '수고했어. 오늘은 많이 버텼으니 잘 쉬어', gain: 8, next: 'care1' },
      { label: '너무 조급해하지 말고 호흡부터 잡아', gain: 6, next: 'care2' },
      { label: '기분 좋으면 통화라도 할까?', gain: 7, next: 'care3' },
    ],
  },
  care1: {
    nextHeroLine: '채은성: 나한테는 이런 말이 가장 정확한 응원 같아. 과장 없이 고마워.',
    choices: [
      { label: '응원 메시지 기록해둘게, 다시 보내도 괜찮지?', gain: 9, next: 'more1' },
      { label: '너한테 잘 맞는 루틴 루프 정리해줄까?', gain: 7, next: 'more2' },
      { label: '난 네 편이야. 오늘은 일찍 자', gain: 6, next: 'more3' },
    ],
  },
  care2: {
    nextHeroLine: '채은성: 단호한 말투가 좋아. 오히려 그게 나한테는 편한 편이야.',
    choices: [
      { label: '좋아, 오늘은 기록만 정리해', gain: 8, next: 'more3' },
      { label: '네가 제일 먼저 쉬는 날은 뭐가 좋을까?', gain: 9, next: 'more2' },
      { label: '아무 말 말고 충분히 쉬어', gain: 6, next: 'more1' },
    ],
  },
  care3: {
    nextHeroLine: '채은성: 그래, 과하게 기대하지 않고 오늘은 이렇게만 끝내자.',
    choices: [
      { label: '통화는 네가 힘이 나는 날에 하자', gain: 9, next: 'more2' },
      { label: '그렇구나, 내가 스케줄 알람 맞춰둘게', gain: 10, next: 'more1' },
      { label: '너는 너무 열심히 하지? 천천히 가자', gain: 8, next: 'more3' },
    ],
  },
  more1: {
    text: '채은성: 좋은 조언이야. 네가 말해주면 오히려 덜 흔들린다.',
    choices: [
      { label: '기록 보면서 조절하면 돼', gain: 8, next: 'end1' },
      { label: '다음 주는 컨디션 우선으로', gain: 9, next: 'end2' },
      { label: '약속은 작은 것부터, 천천히', gain: 6, next: 'end3' },
    ],
  },
  more2: {
    text: '채은성: 루틴을 묶는 건 네 스타일이 잘 맞는다. 안정적인 장단이 좋네.',
    choices: [
      { label: '그럼 내가 다음 루틴 체크표 만들어줄게', gain: 10, next: 'end2' },
      { label: '너무 부담되면 취소해도 돼', gain: 8, next: 'end3' },
      { label: '짧게라도 계속 체크할래', gain: 7, next: 'end1' },
    ],
  },
  more3: {
    text: '채은성: 무리하면 안 돼. 이게 오래 가는 방식이니까.',
    choices: [
      { label: '네 스케줄 기준으로 내가 맞춰볼게', gain: 9, next: 'end1' },
      { label: '내일 아침 리마인드 보낼게', gain: 8, next: 'end2' },
      { label: '오늘은 정말 일찍 자', gain: 10, next: 'end3' },
    ],
  },
  end1: {
    text: '채은성: 오늘 말한 걸 잊지 않을게. 다음엔 더 잘 정리해서 이야기하자.',
    choices: [{ label: '다음 대화로', gain: 3, next: 'start' }],
    end: true,
  },
  end2: {
    text: '채은성: 루틴은 천천히 쌓는 게 이긴다. 너 덕분에 덜 흔들린다.',
    choices: [{ label: '오늘은 여기까지', gain: 4, next: 'start' }],
    end: true,
  },
  end3: {
    text: '채은성: 네가 먼저 지치지 않게 챙겨줬다. 그게 제일 큼.',
    choices: [{ label: '좋은 밤', gain: 4, next: 'start' }],
    end: true,
  },
};

const el = {
  shell: document.getElementById('chatShell'),
  login: document.getElementById('loginScreen'),
  userInput: document.getElementById('userNameInput'),
  loginBtn: document.getElementById('loginBtn'),
  clearBtn: document.getElementById('clearBtn'),
  frame: document.getElementById('chatFrame'),
  status: document.getElementById('heroStatus'),
  avatar: document.getElementById('heroAvatar'),
  heart: document.getElementById('heartText'),
  profileBtn: document.getElementById('profileBtn'),
  input: document.getElementById('chatInput'),
  sendBtn: document.getElementById('sendBtn'),
  heartBtn: document.getElementById('heartBtn'),
};

const state = {
  user: null,
  scene: 'start',
  affinity: 0,
  history: [],
  profileClicks: 0,
  aiMode: false,
  busy: false,
};

let typingBubble = null;

function sanitizeUser(name) {
  return String(name || '').trim().replace(/[\x00-\x1f\x7f]/g, '').slice(0, 24);
}

function storageKey(user) {
  return `${STORAGE_KEY_PREFIX}${encodeURIComponent(user || '').toLowerCase()}`;
}

function stageForAffinity(a) {
  return affinityStages.find((s) => a >= s.min && a <= s.max) || affinityStages[affinityStages.length - 1];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripSpeakerTag(text) {
  return String(text).replace(/^채은성:\s*/g, '');
}

function showTypingIndicator() {
  if (typingBubble) return;
  const row = document.createElement('div');
  row.className = 'msg hero typing';

  const b = document.createElement('div');
  b.className = 'bubble';
  const label = document.createElement('span');
  label.className = 'name-label';
  label.textContent = '채은성';
  b.appendChild(label);

  const dots = document.createElement('span');
  dots.className = 'dots';
  dots.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  b.appendChild(dots);
  row.appendChild(b);
  el.frame.appendChild(row);
  el.frame.scrollTop = el.frame.scrollHeight;
  typingBubble = row;
}

function hideTypingIndicator() {
  if (!typingBubble) return;
  typingBubble.remove();
  typingBubble = null;
}

function setBusy(on) {
  state.busy = on;
  el.sendBtn.disabled = on;
  el.input.disabled = on;
  el.profileBtn.disabled = on;
  el.heartBtn.disabled = on;
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

function bubble(side, text, showName = false) {
  const row = document.createElement('div');
  row.className = `msg ${side}`;
  const b = document.createElement('div');
  b.className = 'bubble';
  if (side === 'hero' && showName) {
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

function appendHistory(who, text) {
  state.history.push({ who, text, at: Date.now() });
  if (state.history.length > 200) state.history = state.history.slice(-200);
}

function applyAffinityGain(rawGain) {
  const base = Number(rawGain || 0);
  const reduced = Math.round(base / AFFINITY_GAIN_DIVISOR);
  return clamp(reduced, 0, MAX_AFFINITY_GAIN);
}

function applyAiAffinityDelta(delta) {
  return clamp(Number(delta || 0), -2, AI_AFFINITY_CLAMP);
}

function normalizeText(text) {
  return text.trim().toLowerCase();
}

function inferChoiceFromText(sceneObj, text) {
  const normalized = normalizeText(text);
  const choices = sceneObj?.choices || [];
  if (!choices.length) return null;

  if (/(통화|통톡|전화|통화할|산책|만남|대면|직접|전화해)/.test(normalized)) return choices[Math.min(2, choices.length - 1)];
  if (/(루틴|기록|정리|체크|일정|알람|약속|스케줄|운동표|체크리스트)/.test(normalized)) return choices[Math.min(1, choices.length - 1)];
  if (/(쉬|안정|휴식|수고|고생|힘들|피로|잠|쉬어|조급)/.test(normalized)) return choices[0];

  const textWords = normalized.split(/\s+/);
  let best = { index: 0, score: 0 };
  choices.forEach((choice, idx) => {
    const label = normalizeText(choice.label);
    const labelWords = label.split(/\s+/);
    const score = labelWords.reduce((acc, w) => (normalized.includes(w) ? acc + 1 : acc), 0)
      + textWords.reduce((acc, w) => (label.includes(w) ? acc + 1 : acc), 0);
    if (score > best.score) best = { index: idx, score };
  });

  return choices[best.score > 0 ? best.index : 0];
}

async function callAI(payload) {
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
    heroText: String(data.heroText),
    affinityDelta: Number(data.affinityDelta) || 0,
    nextScene: data.nextScene,
    status: data.status || null,
  };
}

function getUserSaveKey() {
  return storageKey(state.user);
}

function saveState(notify = false) {
  if (!state.user) return;
  const data = {
    user: state.user,
    scene: state.scene,
    affinity: state.affinity,
    history: state.history,
    profileClicks: state.profileClicks,
    aiMode: state.aiMode,
    updated: Date.now(),
  };
  localStorage.setItem(getUserSaveKey(), JSON.stringify(data));
  localStorage.setItem(LAST_USER_KEY, state.user);
  if (notify) localStorage.setItem(SAVE_NOTES_KEY, `saved@${new Date().toISOString()}`);
}

function loadStateForUser(user) {
  const raw = localStorage.getItem(storageKey(user));
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.user !== user) return false;
    state.scene = parsed.scene || 'start';
    state.affinity = clamp(Number(parsed.affinity) || 0, 0, AFFINITY_MAX);
    state.history = Array.isArray(parsed.history) ? parsed.history : [];
    state.profileClicks = Number(parsed.profileClicks) || 0;
    state.aiMode = Boolean(parsed.aiMode);
    return true;
  } catch {
    return false;
  }
}

function switchToChatScreen() {
  el.login.classList.remove('show');
  el.login.setAttribute('aria-hidden', 'true');
  el.shell.classList.add('active');
  el.shell.setAttribute('aria-hidden', 'false');
  el.input.focus();
}

function renderFromHistory() {
  el.frame.innerHTML = '';
  state.history.forEach((h) => {
    bubble(h.who === 'me' ? 'me' : 'hero', h.text, h.who !== 'me');
  });
  renderStatus();
}

function renderSceneStart() {
  const scene = scenes[state.scene] || scenes.start;
  state.scene = state.scene || 'start';

  const text = scene.text || scene.nextHeroLine || '채은성: ...';
  bubble('hero', stripSpeakerTag(text), true);
  appendHistory('hero', stripSpeakerTag(text));
  if (scene.nextHeroLine) {
    setTimeout(() => {
      const follow = stripSpeakerTag(scene.nextHeroLine);
      bubble('hero', follow, true);
      appendHistory('hero', follow);
      saveState(false);
      renderStatus();
    }, 220);
  }
  renderStatus();
}

async function handleHeroReply(heroLine, nextSceneId = null, delta = 0, useTyping = true, delayMs = RULE_TYPING_DELAY) {
  if (useTyping) {
    showTypingIndicator();
    setBusy(true);
    await sleep(delayMs);
  }

  hideTypingIndicator();
  state.affinity = clamp(state.affinity + delta, 0, AFFINITY_MAX);

  const clean = stripSpeakerTag(heroLine);
  bubble('hero', clean, true);
  appendHistory('hero', clean);

  if (nextSceneId && scenes[nextSceneId]) state.scene = nextSceneId;

  renderStatus();
  saveState(false);
  setBusy(false);

  if (state.scene === 'start' && el.frame.scrollTop >= 0) {
    // no-op
  }
}

async function applyTyped(text) {
  if (state.busy) return;
  const msg = text.trim();
  if (!msg) return;
  el.input.value = '';
  appendHistory('me', msg);
  bubble('me', msg);

  const sceneObj = scenes[state.scene] || scenes.start;

  if (state.aiMode) {
    const ai = await callAI({
      userChoiceLabel: msg,
      userInput: msg,
      scene: state.scene,
      affinity: state.affinity,
      recentHistory: state.history.slice(-8),
      user: state.user,
    }).catch(() => null);

    if (ai) {
      const nextSceneId = scenes[ai.nextScene] ? ai.nextScene : state.scene;
      const clean = stripSpeakerTag(ai.heroText);
      const delta = applyAiAffinityDelta(ai.affinityDelta);
      await handleHeroReply(clean, nextSceneId, delta, true, AI_TYPING_DELAY);
      return;
    }

    const fallback = '답변이 지연돼서, 기본 루틴으로 처리할게. 천천히 가자.';
    await handleHeroReply(fallback, state.scene, 0, true, AI_TYPING_DELAY);
    return;
  }

  const inferred = inferChoiceFromText(sceneObj, msg);
  const chosen = inferred || { next: 'start', gain: 0 };
  state.affinity = clamp(state.affinity + applyAffinityGain(chosen.gain), 0, AFFINITY_MAX);

  const nextScene = scenes[chosen.next] || scenes.start;
  const base = sceneObj.nextHeroLine || nextScene.text || '채은성: ...';
  state.scene = chosen.next;
  await handleHeroReply(base, state.scene, 0, true, RULE_TYPING_DELAY);
}

function doLogin() {
  const user = sanitizeUser(el.userInput.value || '');
  if (!user) {
    el.userInput.focus();
    return;
  }

  state.user = user;
  state.scene = 'start';
  state.affinity = 0;
  state.history = [];
  state.profileClicks = 0;

  if (!loadStateForUser(user)) {
    renderSceneStart();
  } else {
    renderFromHistory();
  }

  saveState(true);
  switchToChatScreen();
  renderStatus();
}

el.loginBtn.addEventListener('click', doLogin);
el.clearBtn.addEventListener('click', () => {
  el.userInput.value = '';
  el.userInput.focus();
});
el.userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    doLogin();
  }
});

el.sendBtn.addEventListener('click', () => {
  if (state.busy || !state.user) return;
  const text = el.input.value;
  if (!text.trim()) return;
  applyTyped(text);
});

el.input?.addEventListener('keydown', (e) => {
  if (state.busy || !state.user) return;
  if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    el.sendBtn.click();
  }
});

el.profileBtn.addEventListener('click', () => {
  if (state.busy || !state.user) return;
  state.profileClicks += 1;
  state.affinity = clamp(state.affinity + 1, 0, AFFINITY_MAX);
  const stage = stageForAffinity(state.affinity);

  const msg = stage.status;
  appendHistory('hero', msg);
  bubble('hero', msg, true);

  if (state.profileClicks % 2 === 0) {
    const extra = '상태를 눌렀더니 오늘 분위기가 한결 정리됐다.';
    appendHistory('hero', extra);
    bubble('hero', extra, true);
  }

  renderStatus();
  saveState(false);
});

el.heartBtn?.addEventListener('click', () => {
  const want = prompt('AI 모드(채팅형)로 전환할까요? (yes 입력 시 ON, 아니면 OFF)');
  if (want && want.toLowerCase() === 'yes') {
    state.aiMode = true;
    alert('AI 모드 ON. /api/reply 브리지 연결이 필요해요.');
  } else if (want) {
    state.aiMode = false;
    alert('AI 모드 OFF. 규칙 기반으로 진행할게.');
  }
  renderStatus();
  saveState(false);
});

function boot() {
  const lastUser = sanitizeUser(localStorage.getItem(LAST_USER_KEY));
  if (lastUser) {
    el.userInput.value = lastUser;
  }

  el.login.classList.add('show');
  el.login.setAttribute('aria-hidden', 'false');
  el.shell.classList.remove('active');
  el.shell.setAttribute('aria-hidden', 'true');
  setTimeout(() => el.userInput.focus(), 10);
}

boot();
