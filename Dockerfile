FROM node:15.8.0-alpine3.10

ENV HOST=
ENV USER=
ENV PASS=
ENV DB=
ENV PORT=$PORT

WORKDIR /usr/app

COPY ./ ./

RUN npm install

EXPOSE 3306
EXPOSE $PORT

CMD [ "node", "server.js" ]