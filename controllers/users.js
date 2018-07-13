const User = require('../models/user');

function indexRoute(req, res, next) {
  User
    .find()
    // .populate('createdBy')
    .exec()
    .then((users) => res.render('users/index', {users}))
    .catch(next);
}

function newRoute(req, res) {
  res.render('users/new');
}

function createRoute(req, res) {
  User
    .create(req.body)
    .then(() => res.redirect('/users'));
}

function showRoute(req, res, next) {
  User
    .findById(req.params.id)
    .then((user) => {
      if(!user) res.notFound();
      const err = new Error('Not Found');
      res.render('users/show', {user});
    })
    .catch(next);
}

function editRoute(req, res) {
  User
    .findById(req.params.id)
    // .exec()
    .then((user) => {
      if(!user) return res.notFound();
      res.render('users/edit', {user});
    });
}

function updateRoute(req,res) {
  User
    .findById(req.params.id)
    // .exec()
    .then((user) => {
      if(!user) return res.notFound();

      // A For Loop equivalent to:
      // book.title = req.body.title;
      // book.author = req.body.author;
      // book.description = req.body.description;
      for(const field in req.body) {
        user[field] = req.body[field];
      }

      return user.save();
    })
    .then((user) => res.redirect(`/users/${user.id}`));
}

function deleteRoute(req, res) {
  User
    .findById(req.params.id)
    .then((user) => {
      if(!user) return res.notFound();
      return user.remove();
    })
    .then(() => res.redirect('/users'));
}

//export above functions
module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute
}
