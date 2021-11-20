import express, {Router} from 'express'
import FoodController from '../controllers/foodController'

const router: Router = express.Router()
const foodController = new FoodController()

router.post('/find', foodController.find)
// router.post('/', foodController.add)
router.post('/add-or-update', foodController.addOrUpdate)
router.post('/delete', foodController.delete)
router.get('/get-chart-data', foodController.getChartData)

export default router