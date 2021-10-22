import express, {Router} from 'express'
import FamilyController from '../controllers/familyController'

const router: Router = express.Router()
const familyController = new FamilyController()

router.get('/list-all', familyController.listFamily)
router.post('/add', familyController.addFamily)

export default router