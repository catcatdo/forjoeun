const scenes = {
  start: {
    character: '🌙',
    text: '어젯밤 내린 비가 그치고, 캠퍼스 잔디밭은 은은한 안개를 머금고 있었어. 문득 너를 찾아가고 싶은 마음이 커진다.',
    choices: [
      { label: '도서관으로 함께 가자고 말한다', next: 'pathStudy' },
      { label: '카페에서 쉬자고 말한다', next: 'pathCafe' },
      { label: '오늘은 말없이 먼저 안부만 묻는다', next: 'pathTalk' },
    ]
  },
  pathStudy: {
    character: '📚',
    text: '도서관의 조용한 분위기에서 얇은 간격으로 속삭이는 마음들. 첫 페이지의 끝, 서로의 표정이 부드러워져.',
    choices: [
      { label: '한 챕터를 같이 읽는다', next: 'endingSoft' },
      { label: '중간에 산책을 제안한다', next: 'endingCafe' }
    ]
  },
  pathCafe: {
    character: '☕',
    text: '카페에는 잔잔한 재즈가 깔리고, 네가 웃는 만큼 내 질문도 느려졌다. 오늘은 급하게 말할 필요가 없다.',
    choices: [
      { label: '음료를 같이 고른다', next: 'endingSoft' },
      { label: '창밖 풍경만 같이 본다', next: 'endingNature' }
    ]
  },
  pathTalk: {
    character: '💬',
    text: '짧은 안부 메시지는 큰 문장을 대신했어. 상대의 답장을 기다리는 사이, 마음도 조심스럽게 열리기 시작해.',
    choices: [
      { label: '천천히 산책 약속을 잡는다', next: 'endingSoft' },
      { label: '다음 주 공연 영상을 같이 본다', next: 'endingNature' }
    ]
  },
  endingSoft: {
    character: '🌿',
    text: '너는 오늘 마음이 급하지 않다는 걸 알아줬고, 나는 그게 고마웠어. 천천히, 그러나 분명한 신뢰가 쌓이는 밤이 된다.',
    choices: []
  },
  endingCafe: {
    character: '🍵',
    text: '산책길에서 둘이 웃다가 잠깐 말이 끊겼다. 그 침묵이 이상하게 편안해서, 나는 그 순간을 오래 간직했어.',
    choices: []
  },
  endingNature: {
    character: '🌌',
    text: '정답이 필요 없는 대화는 결국 더 또렷해졌다. 천천히 마음을 나누는 게, 오늘의 가장 안전한 결말이었어.',
    choices: []
  }
};

const key = 'forjoeun_vn_save_v1';
const storyEl = document.getElementById('text');
const charEl = document.getElementById('character');
const choiceWrap = document.getElementById('choices');

function render(id) {
  const scene = scenes[id];
  if (!scene) return;
  localStorage.setItem(key, id);
  charEl.textContent = scene.character || '🌙';
  storyEl.textContent = scene.text || '';
  choiceWrap.innerHTML = '';

  scene.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = choice.label;
    btn.onclick = () => render(choice.next);
    choiceWrap.appendChild(btn);
  });

  if (!scene.choices || scene.choices.length === 0) {
    const reset = document.createElement('button');
    reset.className = 'choice';
    reset.textContent = '다시 시작';
    reset.onclick = () => render('start');
    choiceWrap.appendChild(reset);
  }
}

function saveGame() {
  const current = localStorage.getItem(key);
  alert(`저장됨: ${current || 'start'}`);
}
function loadGame() {
  const saved = localStorage.getItem(key);
  render(saved || 'start');
}
function resetGame() {
  localStorage.removeItem(key);
  render('start');
}

document.getElementById('saveBtn').addEventListener('click', saveGame);
document.getElementById('loadBtn').addEventListener('click', loadGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);

render('start');
