FROM mcr.microsoft.com/playwright:v1.61.1-noble
WORKDIR /work
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "playwright", "test"]