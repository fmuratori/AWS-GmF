FROM node:12-alpine

ENV WORKINGDIR=/app

#indica dove verranno eseguiti i comandi indicati da RUN
WORKDIR $WORKINGDIR

#copia tutti i file e directory nel container
COPY . ${WORKINGDIR}/

RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "serve"]