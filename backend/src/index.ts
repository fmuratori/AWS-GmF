import express, { Application } from 'express'
import cors from 'cors'
import path from 'path'
import mongoose, { ConnectOptions } from 'mongoose'
import foodRouter from './routes/foodRoutes'

const PORT = 3000;
const DB = 'mongodb://localhost:27017/test'
const app: Application = express()

// global.appRoot = path.resolve(__dirname);

mongoose
  .connect(DB)
  .then(() => {'DB connection successfull'})

app.use(cors()) //Per gestire i parametri passati nel corpo della richiesta http.
app.use(express.json());

app.use('/api/food', foodRouter)

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(PORT, function () {
  console.log('Node API server started on port ' + PORT);
});
