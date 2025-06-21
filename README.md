# FootFit - 재료 기반 음식 추천 웹사이트

가지고 있는 재료를 입력하면 만들 수 있는 요리를 추천해주는 웹사이트입니다.

## 주요 기능

- **재료 기반 레시피 검색**: 가지고 있는 재료를 입력하면 가능한 요리를 찾아줍니다
- **맞춤 추천 알고리즘**: 재료 매칭률에 따라 최적의 요리를 추천합니다
- **상세 레시피 정보**: 조리 방법, 영양 정보, 조리 팁 등을 제공합니다
- **사용자 인증**: 회원가입/로그인 기능을 통해 개인화된 서비스를 제공합니다
- **반응형 디자인**: 모바일과 데스크톱에서 모두 사용할 수 있습니다

## 기술 스택

### 백엔드
- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **MySQL** - 데이터베이스
- **JWT** - 인증 토큰
- **bcryptjs** - 비밀번호 해시화

### 프론트엔드
- **HTML5** - 마크업
- **CSS3** - 스타일링
- **JavaScript (ES6+)** - 클라이언트 사이드 로직
- **Font Awesome** - 아이콘

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd footfit
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=food_db
JWT_SECRET=your_secret_key
```

### 4. 데이터베이스 설정
1. MySQL 서버를 실행하세요
2. `food_db` 데이터베이스를 생성하세요
3. 제공된 `food_db.sql` 파일을 실행하여 테이블과 데이터를 생성하세요

### 5. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

### 6. 웹사이트 접속
브라우저에서 `http://localhost:3000`으로 접속하세요.

## 프로젝트 구조

```
footfit/
├── backend/
│   ├── server.js          # 메인 서버 파일
│   ├── routes/            # API 라우트
│   │   ├── auth.js        # 인증 관련 라우트
│   │   ├── recipes.js     # 레시피 관련 라우트
│   │   └── ingredients.js # 재료 관련 라우트
│   └── config/
│       └── database.js    # 데이터베이스 설정
├── frontend/
│   ├── index.html         # 홈 페이지
│   ├── login.html         # 로그인 페이지
│   ├── register.html      # 회원가입 페이지
│   ├── recipes.html       # 레시피 목록 페이지
│   ├── recipe-detail.html # 레시피 상세 페이지
│   ├── css/
│   │   └── style.css      # 스타일시트
│   └── js/
│       ├── main.js        # 메인 JavaScript
│       ├── auth.js        # 인증 관련 JavaScript
│       ├── recipes.js     # 레시피 목록 JavaScript
│       └── recipe-detail.js # 레시피 상세 JavaScript
├── package.json
└── README.md
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 레시피
- `POST /api/recipes/search` - 재료 기반 레시피 검색
- `GET /api/recipes/:id` - 레시피 상세 정보
- `GET /api/recipes/ingredients/list` - 모든 재료 목록

### 재료
- `GET /api/ingredients` - 모든 재료 목록
- `GET /api/ingredients/search?q=query` - 재료 검색

## 추천 알고리즘

레시피 추천은 다음과 같은 기준으로 이루어집니다:

1. **재료 매칭률**: 입력한 재료가 레시피에 포함된 재료와 얼마나 일치하는지 계산
2. **매칭 재료 수**: 일치하는 재료의 개수
3. **전체 재료 대비 비율**: 매칭률을 백분율로 계산하여 정렬

## 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요. 