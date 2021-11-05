import express, {Router} from 'express'
import EventController from '../controllers/eventController'

const router: Router = express.Router()
const eventController = new EventController()

router.post('/', eventController.find)
router.post('/edit', eventController.add)
router.put('/', eventController.edit)
router.delete('/', eventController.delete)

export default router