FROM node:latest

WORKDIR /newapp

COPY . .

RUN npm install 

EXPOSE 3000

CMD ["npm","install"]
