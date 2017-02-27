const router = require('express').Router();

const {
  addMachine,
  deleteMachine,
  modifyMachine,
  getAllMachine,
  getMachineById
} = require('../controllers/machine');

const { refreshToken } = require('../controllers/auth');
router.use(refreshToken);

router.post('/', addMachine);
router.delete('/:id', deleteMachine);
router.put('/:id', modifyMachine);
router.get('/', getAllMachine);
router.get('/:id', getMachineById);

module.exports = router;
