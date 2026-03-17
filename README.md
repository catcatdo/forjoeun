# forjoeun

아이폰에서도 쓸 수 있는 **카톡형 채팅 미연시**입니다.

## 현재 기능
- 주인공: **채은성**(한화이글스 느낌)
- 카톡형 말풍선 UI
- 호감도 기반 스테이터스 메시지 및 프로필 반응
- 선택지 + 직접 입력 기반 채팅 진행(원하면 직접 타이핑 가능)
- 사용자 입력 후 상대가 타이핑 중처럼 보이는 애니메이션(점점표시) 반영
- localStorage 세이브/불러오기
- **Codex 연동 브리지(옵션)**: `ai 모드`를 켜면 `/api/reply`로 대사를 생성

## 프로필 사진
폴더: `assets/profile/`
- stage1~7.png 파일을 넣으면 호감도 단계별로 자동 변경

## Codex 브리지 실행법 (선택)
1) 프로젝트 루트에서:
```bash
npm install  # 최초 1회
npm run bridge
```
2) 브라우저에서 `index.html` 또는 정적 서버로 실행
3) 대화에서 `❤` 수치(혹은 상태 버튼)에서 `yes` 입력 시 AI 모드 ON

주의: AI 모드는 `localhost`에서 동작하는 Codex 브리지 서버가 필요합니다.

## GitHub Pages
GitHub Pages는 정적 호스팅이라 `/api/reply` 브리지는 동작하지 않습니다.
그래도 스토리는 기존 규칙 기반으로 완전 동작합니다.
페이지 배포: Settings → Pages → Deploy from branch (`main`, `root`).
