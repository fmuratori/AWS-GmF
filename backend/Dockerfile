FROM node:12-alpine

ENV WORKINGDIR=/app

#indica dove verranno eseguiti i comandi indicati da RUN
WORKDIR $WORKINGDIR

#copia tutti i file e directory nel container
COPY . ${WORKINGDIR}/

RUN npm install
RUN npm run build

EXPOSE 3000
EXPOSE 3001
CMD ["npm", "run", "start"]