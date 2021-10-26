import express, {Router} from 'express'
import EventController from '../controllers/eventController'

const router: Router = express.Router()
const eventController = new EventController()

router.get('/list-all', eventController.listAll)
router.post('/add', eventController.add)

export default router