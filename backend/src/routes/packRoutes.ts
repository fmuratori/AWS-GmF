import express, {Router} from 'express'
import PackController from '../controllers/packController'

const router: Router = express.Router()
const packController = new PackController()

router.post('/find', packController.find)
router.post('/add', packController.add)
// router.post('/edit', packController.edit)
router.post('/delete', packController.delete)
router.post('/delivered', packController.setDelivered)
router.post('/planned-delivery', packController.setPlannedDelivery)

export default router