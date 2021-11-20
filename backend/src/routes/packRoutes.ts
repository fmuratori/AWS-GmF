import express, {Router} from 'express'
import PackController from '../controllers/packController'

const router: Router = express.Router()
const packController = new PackController()

router.post('/find', packController.find)
router.post('/add', packController.add)
// router.post('/edit', packController.edit)
router.post('/delete', packController.delete)
router.post('/advance', packController.advanceStatus)

export default router