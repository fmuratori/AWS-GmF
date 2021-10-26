import express, {Router} from 'express'
import PackController from '../controllers/packController'

const router: Router = express.Router()
const packController = new PackController()

router.get('/list-all', packController.listAll)
router.post('/add', packController.add)

export default router