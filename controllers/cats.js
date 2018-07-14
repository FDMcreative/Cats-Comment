const Cat = require('../models/cat');

function indexRoute(req, res, next) {
  Cat
    .find()
    .populate('createdBy')
    .exec()
    .then((cats) => res.render('cats/index', {cats}))
    .catch(next);
}

function newRoute(req, res) {
  res.render('cats/new');
}

function createRoute(req, res, next) {

  req.body.createdBy = req.user;

  Cat
    .create(req.body)
    .then(() => res.redirect('/cats'))
    .catch((err) => {
      if(err.name === 'ValidateError') return res.badRequest(`/cats/${req.params.id}/edit`, err.toString());
      next(err);
    });
}

function showRoute(req, res, next) {
  Cat
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((cat) => {
      if(!cat) return  res.notFound();
      return res.render('cats/show', {cat});
    })
    .catch(next);
}

function editRoute(req, res, next) {
  Cat
    .findById(req.params.id)
    .exec()
    .then((cat) => {
      return res.render('cats/edit', {cat});
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Cat
    .findById(req.params.id)
    .exec()
    .then((cat) => {
      if(!cat) return res.notFound();

      for(const field in req.body) {
        cat[field] = req.body[field];
      }

      return cat.save();
    })
    .then(() => res.redirect(`/cats/${req.params.id}`))
    .catch((err) => {
      if(err.name === 'ValidateError') return res.badRequest(`/cats/${req.params.id}/edit`, err.toString());
      next(err);
    });
}

function deleteRoute(req, res, next) {
  Cat
    .findById(req.params.id)
    .exec()
    .then((cat) => {
      if(!cat) return res.notFound();
      return cat.remove();
    })
    .then(() => res.redirect('/cats'))
    .catch(next);
}

function createCommentRoute(req, res, next) {

  req.body.createdBy = req.user; // N.B. without this line, comments will not work beecause it doesn't know who is the owner of the comments!

  Cat
    .findById(req.params.id)
    .exec()
    .then((cat) => {
      if(!cat) return res.notFound();

      cat.comments.push(req.body); //create an embedded record
      return cat.save();
    })
    .then((cat) => res.redirect(`/cats/${cat.id}`))
    .catch(next);
}

function deleteCommentRoute(req, res, next) {
  Cat
    .findById(req.params.id)
    .exec()
    .then((cat) => {
      if(!cat) return res.notFound();
      //get the embedded record by its id
      const comment = cat.comments.id(req.params.commentId);
      comment.remove();

      return cat.save();
    })
    .then((cat) => res.redirect(`/cats/${cat.id}`))
    .catch(next);
}

//export above functions
module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  createComment: createCommentRoute,
  deleteComment: deleteCommentRoute
};
