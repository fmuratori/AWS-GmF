import express, {Router} from 'express'
import FoodController from '../controllers/foodController'

const router: Router = express.Router()
const foodController = new FoodController()

router.post('/', foodController.find)
// router.post('/', foodController.add)
router.post('/', foodController.addOrUpdate)
router.delete('/', foodController.delete)

export default router