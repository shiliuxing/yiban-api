const router = require('express').Router();

const {
  addActivity,
  deleteActivity,
  modifyActivity,
  getActivity
} = require('../controllers/activity');

router.post('/', addActivity);
router.delete('/:id', deleteActivity);
router.put('/:id', modifyActivity);
router.get('/', getActivity);

module.exports = router;
