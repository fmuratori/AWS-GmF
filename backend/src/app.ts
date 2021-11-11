import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import donationRouter from './routes/donationRoutes'
import eventRoutes from './routes/eventRoutes'
import familyRoutes from './routes/familyRoutes'
import foodRouter from './routes/foodRoutes'
import packRoutes from './routes/packRoutes'
import userRoutes from './routes/userRoutes'
import { verifyToken } from './utils/tokenHandler'

const app: Application = express()
const port = process.env.PORT || 3000

app.use(cors()) //Per gestire i parametri passati nel corpo della richiesta http.
app.use(express.json());

//passaggio di validazione del token
app.use((req: Request, res: Response, next: NextFunction) => {
  if(process.env.USE_JWT === "false") {
    next()
    return
  }

  const token = req.headers["x-access-token"]
  const userId = req.headers["x-user-id"]

  //se l'utente deve loggarsi/registrarsi non controllo il token
  if (req.path != "/api/user/login" && req.path != "/api/user/register") {

    //l'utente deve autenticarsi col token se non sta chiamando l'endpoint di login o di registrazione 
    if (!token) {
      res.status(401).json({
        "status": "missing-token-error",
        "message": "Missing token in header x-access-token"
      })
      return
    }

    //per la verifica del token bisogna passare anche l'id dell'utente nel body della chaiamata
    if(!userId){
      res.status(401).json({
        "status": "missing-id-error",
        "message": "Missing user id in header x-user-id"
      })
      return
    }

    //validazione del token
    if (!verifyToken("" + token, "" + userId)) {
      res.status(401).json({
        "status": "wrong-token-error",
        "message": "Wrong token"
      })
      return
    }
  }

  next()
})

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