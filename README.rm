# istanzio la rete virtuale interna

docker network create -d bridge interna

# verifico lo stato della rete

docker network ls
docker network inspect interna

# per la build dell'immagine

docker-compose build

# per istanziare l'immagine

docker-compose up

# ricordarsi di cambiare l'url del db nell'env del backend (da LOCAL a PROD)