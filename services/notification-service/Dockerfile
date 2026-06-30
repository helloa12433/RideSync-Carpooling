FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY dist/ ./dist/

ENV NODE_ENV=production
ENV PORT=3006

EXPOSE 3006

CMD ["node", "dist/server.js"]
