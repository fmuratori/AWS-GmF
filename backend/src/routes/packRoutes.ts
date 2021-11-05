import express, {Router} from 'express'
import PackController from '../controllers/packController'

const router: Router = express.Router()
const packController = new PackController()

router.get('/', packController.get)
router.post('/', packController.add)
router.put('/', packController.edit)
router.delete('/', packController.delete)

export default router