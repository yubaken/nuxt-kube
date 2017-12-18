FROM node:8.5.0-slim

COPY . /app
WORKDIR app
ENV TZ=Japan
RUN npm run build

EXPOSE 3000

CMD npm run start
