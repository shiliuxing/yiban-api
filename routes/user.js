const router = require('express').Router();

const {
  addUser,
  deleteUser,
  modifyUser,
  getUser,
} = require('../controllers/user');

const { checkLogin } = require('../controllers/auth');
router.use(checkLogin);

router.post('/', addUser);
router.delete('/:id', deleteUser);
router.put('/:id', modifyUser);
router.get('/', getUser);

module.exports = router;
