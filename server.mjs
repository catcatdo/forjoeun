import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

const PORT = Number(process.env.PORT || 4173);

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 100000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function send(res, code, obj) {
  const payload = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(payload);
}

function callCodex(payload) {
  return new Promise((resolve, reject) => {
    const prompt = `
너는 "채은성"이라는 KBO 한화 이글스 출신 성격의 캐릭터 연동 AI야.
지금부터 대화 게임의 다음 응답을 생성한다.

[규칙]
- 성격은 ISTJ: 직설적, 무난하고 정중함, 과장 없는 현실감 있는 대화.
- 금지: 과도한 미성년/성적/음란 요소, 폭력적 표현, 개인정보 유출 요청.
- 항상 한국어 반말 톤, 짧고 단단한 어조.
- 대화는 상대의 감정을 존중하되 감정폭발하지 않음.
- 현재 캐릭터는 장문보다 가볍고 현실적인 톤. 먼저 공감, 다음 한 문장 제안으로 마무리.

[현재 상태]
- 현재 씬: ${payload.scene || 'start'}
- 호감도: ${payload.affinity || 0}
- 사용자 입력(기본): ${payload.userInput || payload.userChoiceLabel || '없음'}
- 최근 히스토리 요약(짧게): ${JSON.stringify(payload.recentHistory || [])}

[출력 형식]
아래 JSON만 반환해. 코드블럭/설명/추가문장 금지.
{
  "heroText": "채은성의 실제 채팅 답장 (한두 문장, 너무 길지 않게)",
  "affinityDelta": 숫자 (정수, -2~+6 권장),
  "nextScene": "start|care1|care2|...|end1|end2|end3 중 하나, 모르는 값은 start",
  "status": "상태메시지 1문장"
}
`.trim();

    const child = spawn('codex', ['exec', '--full-auto', prompt]);
    let out = '';
    let err = '';

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('codex-timeout'));
    }, 20000);

    child.stdout.on('data', (chunk) => {
      out += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      err += chunk.toString();
    });

    child.on('error', (e) => reject(e));
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        return reject(new Error(`codex-exit-${code}: ${err}`));
      }

      const start = out.indexOf('{');
      const end = out.lastIndexOf('}');
      if (start === -1 || end === -1) {
        return reject(new Error('codex-no-json'));
      }
      const raw = out.slice(start, end + 1);
      try {
        const data = JSON.parse(raw);
        resolve(data);
      } catch (e) {
        reject(new Error(`codex-json-parse:${e.message}`));
      }
    });
  });
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 200, { ok: true });
  }

  if (req.url === '/api/reply' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const data = await callCodex(body);
      return send(res, 200, { ok: true, ...data });
    } catch (err) {
      return send(res, 502, {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (req.url === '/health' && req.method === 'GET') {
    return send(res, 200, { ok: true, service: 'forjoeun-codex-bridge' });
  }

  send(res, 404, { ok: false, error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`forjoeun codex bridge running at http://localhost:${PORT}`);
});
