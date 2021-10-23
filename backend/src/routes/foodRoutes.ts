import express, {Router} from 'express'
import FoodController from '../controllers/foodController'

const router: Router = express.Router()
const foodController = new FoodController()

router.get('/list-all', foodController.listFood)
router.post('/add', foodController.addFood)

router.get('/list-all-ordered', foodController.listOrderedByNumber)
router.post('/add-or-update', foodController.addOrUpdate)


export default router