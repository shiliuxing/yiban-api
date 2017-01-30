const router = require('express').Router();

const {
  addRecord,
  deleteRecord,
  modifyRecord,
  getRecord,
} = require('../controllers/record');

router.post('/', addRecord);
router.delete('/:id', deleteRecord);
router.put('/:id', modifyRecord);
router.get('/', getRecord);

module.exports = router;
