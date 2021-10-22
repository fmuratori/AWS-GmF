import express, {Router} from 'express'
import PackController from '../controllers/packController'

const router: Router = express.Router()
const packController = new PackController()

router.get('/list-all', packController.listFood)
router.post('/add', packController.addFood)

export default router