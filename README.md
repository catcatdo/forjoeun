# forjoeun

아이폰에서도 쓸 수 있는 **카톡 느낌 미연시 웹 템플릿**입니다.

## 핵심 변경점
- 카톡형 채팅 UI(좌/우 말풍선)
- 주인공: **채은성**(한화이글스 야구선수 느낌 캐릭터)
- 대화 선택지로 진행되는 간단한 호감도 시스템
- 프로필 사진 클릭 시 호감도 상태/상태메시지 업데이트 느낌 연출
- 호감도 단계별로 프로필 이미지 경로 자동 변경(폴더 준비)
- localStorage 세이브/불러오기

## 프로필 사진 폴더
아래 폴더에 네가 사진을 넣으면 됩니다.

- `assets/profile/stage1.png`
- `assets/profile/stage2.png`
- `assets/profile/stage3.png`
- `assets/profile/stage4.png`
- `assets/profile/stage5.png`
- `assets/profile/stage6.png`
- `assets/profile/stage7.png`

없으면 기본 아바타 영역으로 표시되고, 배경색/상태만 동작해요.

## 실행

```bash
cd /Users/mechako/forjoeun
open index.html
```

## GitHub Pages 배포
- GitHub에 `forjoeun` 레포 push
- Settings → Pages → `main` / `root`로 배포
- 주소: `https://catcatdo.github.io/forjoeun/`

원하면 다음 단계로:
- 대화 데이터를 별도 `story.json`으로 분리
- 호감도에 따른 분기 결말(좋음/평온/거리 두기) 3종
- 알림/이모지/배경 효과 추가 가능
