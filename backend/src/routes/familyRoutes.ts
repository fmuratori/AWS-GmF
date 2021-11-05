import express, {Router} from 'express'
import FamilyController from '../controllers/familyController'

const router: Router = express.Router()
const familyController = new FamilyController()

router.get('/', familyController.get)
router.post('/', familyController.add)
router.put('/', familyController.edit)
router.delete('/', familyController.delete)

export default router