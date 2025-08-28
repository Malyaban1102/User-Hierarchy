const router = require('express').Router();
const auth = require('../middleware/auth');
const { permit } = require('../middleware/rbac');
const { customerReadOnly } = require('../middleware/readonly');
const ctrl = require('../controllers/customer.controller');

router.use(auth, customerReadOnly);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.get('/:id/tree', ctrl.subtree);

// Super Admin write actions
router.post('/', permit('SUPER_ADMIN'), ctrl.create);
router.put('/:id', permit('SUPER_ADMIN'), ctrl.update);
router.delete('/:id', permit('SUPER_ADMIN'), ctrl.remove);

module.exports = router;
