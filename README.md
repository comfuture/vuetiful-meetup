# Vuetiful Meetup

뷰티플코리아 밋업 참가자 및 스탭이 사용할 웹앱

## Features

### For attendee
- [ ] 밋업 일정 및 정보
- [ ] 밋업 등록 정보 조회
- [x] 이메일로 로그인
- ~[ ] 문자 인증번호로 로그인~

### For staff
- [x] 참가자 목록 열람
- [x] 참가자 목록 검색
- [ ] 참가자 체크인
  * [x] 매뉴얼 체크인
  * [ ] 바코드로 체크인

### For organizer
- [x] 밋업 생성
- [x] 참가자 목록 벌크 업로드


## Development

1. Obtain a Firebase Project ID to use for this project. [See Overiew Here](#firebase-project-setup)

2. install dependencies
```bash
npm i
cd src && npm i
cd prod/server && npm i
```

3. Build The Project

In root directory, run
```bash
npm run build
```

4. Run locally
```bash
npm run serve
```

5. Deploy
```bash
npm run deploy
```

For rapid development, just run `npm run dev` in src directory.
