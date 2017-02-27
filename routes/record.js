const router = require('express').Router();

const {
  addRecord,
  deleteRecord,
  modifyRecord,
  getRecord,
  getByActivity,
  getByRealname,
  getByStudentId
} = require('../controllers/record');

const { refreshToken } = require('../controllers/auth');
router.use(refreshToken);

router.post('/', addRecord);
router.delete('/:id', deleteRecord);
router.put('/:id', modifyRecord);

router.get('/', getRecord);
router.get('/activity/:name', getByActivity);
router.get('/user/name/:name', getByRealname);
router.get('/user/id/:id', getByStudentId);

module.exports = router;
