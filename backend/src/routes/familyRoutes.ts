import express, {Router} from 'express'
import FamilyController from '../controllers/familyController'

const router: Router = express.Router()
const familyController = new FamilyController()

router.post('/', familyController.find)
router.post('/edit', familyController.add)
router.put('/', familyController.edit)
router.delete('/', familyController.delete)

export default router