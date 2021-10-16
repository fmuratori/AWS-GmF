const PORT = 8080
const express = require('express')
const app = express()
const path = require('path')


app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'index.html'))
)

app.listen(PORT, () =>
    console.log('Listening on port ' + PORT + '...')
)