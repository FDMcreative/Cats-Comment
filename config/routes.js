const router = require('express').Router();
const secureRoute = require('../lib/secureRoute');
const sessions = require('../controllers/sessions');
const registrations = require('../controllers/registrations');
const users = require('../controllers/users');

router.get('/', (req, res) => res.render('statics/index'));

router.route('/users')
  .get(users.index)

router.route('/users/:id/edit')
  .get(secureRoute, users.edit);

router.route('/users/:id')
  .get(users.show)
  .put(secureRoute, users.update)
  .delete(secureRoute, users.delete);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.all('*', (req, res) => res.notFound());

module.exports = router;
