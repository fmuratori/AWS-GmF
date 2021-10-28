FROM node:12-alpine
#RUN apk add --no-cache python g++ make
#RUN apt-get update && apt-get upgrade -y
#RUN apt-get install python3 -y

ENV WORKINGDIR=/app
WORKDIR $WORKINGDIR

COPY . ${WORKINGDIR}/

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]