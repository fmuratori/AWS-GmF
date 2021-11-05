import express, {Router} from 'express'
import EventController from '../controllers/eventController'

const router: Router = express.Router()
const eventController = new EventController()

router.post('/find', eventController.find)
router.post('/add', eventController.add)
router.post('/edit', eventController.edit)
router.post('/delete', eventController.delete)

export default router