const router = require('express').Router();

const {
  addActivity,
  deleteActivity,
  modifyActivity,
  getActivity,
  getActivityByName
} = require('../controllers/activity');

router.post('/', addActivity);
router.delete('/:id', deleteActivity);
router.put('/:id', modifyActivity);
router.get('/', getActivity);
router.get('/:name', getActivityByName);

module.exports = router;
