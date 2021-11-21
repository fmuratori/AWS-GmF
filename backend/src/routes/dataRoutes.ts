import express, {Router} from 'express'
import DataController from '../controllers/dataController'

const router: Router = express.Router()
const dataController = new DataController()

router.get('/food-labels', dataController.getFoodLabelsData)
router.get('/next-events', dataController.getNextEvents)
router.get('/count', dataController.getCountsData)

export default router