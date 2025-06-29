FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --only=production

# 소스 코드 복사
COPY . .

# 포트 설정
EXPOSE 8080

# 애플리케이션 실행
CMD ["npm", "start"] 