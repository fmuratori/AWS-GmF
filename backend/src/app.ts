import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import donationRouter from './routes/donationRoutes'
import eventRoutes from './routes/eventRoutes'
import familyRoutes from './routes/familyRoutes'
import foodRouter from './routes/foodRoutes'
import packRoutes from './routes/packRoutes'
import userRoutes from './routes/userRoutes'
import checkJWT from "./utils/checkJWT"

const app: Application = express()
const port = process.env.PORT || 3000

app.use(cors()) //Per gestire i parametri passati nel corpo della richiesta http.
app.use(express.json());

//passaggio di validazione del token
app.use((req: Request, res: Response, next: NextFunction) => checkJWT(req, res, next))

app.use('/api/donation', donationRouter)
app.use('/api/event', eventRoutes)
app.use('/api/family', familyRoutes)
app.use('/api/food', foodRouter)
app.use('/api/pack', packRoutes)
app.use('/api/user', userRoutes)

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port, () => {
  console.log('Node API server started on port ' + port);
});

export default app