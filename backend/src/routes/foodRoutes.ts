import express, {Router} from 'express'
import FoodController from '../controllers/foodController'

const router: Router = express.Router()
const foodController = new FoodController()

router.get('/list-all', foodController.listAll)
router.post('/add', foodController.add)

router.post('/add-or-update', foodController.addOrUpdate)

export default router