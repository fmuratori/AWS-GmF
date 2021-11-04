import express, {Router} from 'express'
import FamilyController from '../controllers/familyController'

const router: Router = express.Router()
const familyController = new FamilyController()

router.get('/list-all', familyController.listAll)
router.post('/add', familyController.add)
router.post('/edit', familyController.edit)

export default router