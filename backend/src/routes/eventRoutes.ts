import express, {Router} from 'express'
import EventController from '../controllers/eventController'

const router: Router = express.Router()
const eventController = new EventController()

router.get('/list-all', eventController.listFood)
router.post('/add', eventController.addFood)

export default router