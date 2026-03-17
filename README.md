# forjoeun

아이폰에서 바로 접속 가능한 간단한 텍스트 기반 미연시(선택지형) 웹 템플릿입니다.

## 구조
- `index.html` : 화면 UI
- `style.css` : 모바일 최적화 스타일
- `script.js` : 분기 엔진(씬/선택지)

## 바로 실행
브라우저에서 `index.html` 열기

## GitHub Pages 배포(요약)
1. GitHub에 새 레포 생성: `forjoeun`
2. 이 폴더를 업로드/푸시
3. Pages 설정에서 Source: `Deploy from a branch` + `main / root`
4. 배포 완료 후 `https://<USER>.github.io/forjoeun/` 접속

## 커스터마이즈
- `script.js`의 `scenes` 객체에 씬과 선택지를 추가/수정
- 캐릭터 아트는 `character` 텍스트 대신 이미지 태그로 확장 가능
- 로컬 저장은 `localStorage`로 자동 세이브 슬롯 1개

## 주의
- 현재는 성인/야한 장면 없음, 온건한 분위기 라이트 노벨/로맨스/우정 톤으로 구성
