const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI } = require('../config/environment');
mongoose.connect(dbURI, {useNewUrlParser: true });

const User = require('../models/user');

User.collection.drop();

User
  .create([{
    username: 'federico',
    name: 'Federico Delmi',
    gender: 'Male',
    age: 36,
    country: 'Italy',
    faculty: 'Lettere',
    image: 'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&h=350',
    email: 'federico@gigi.com',
    password: 'passwordfederico',
    passwordConfirmation: 'passwordfederico'
  },{
    username: 'gigi',
    name: 'Gigi Dima',
    gender: 'Undefined',
    age: 31,
    country: 'Italy',
    faculty: 'Scienze della Comunicazione',
    image: 'https://www.agenpress.it/notizie/wp-content/uploads/2017/12/di-maio-4.jpg',
    email: 'gigi@gigi.com',
    password: 'passwordgigi',
    passwordConfirmation: 'passwordgigi'
  },{
    username: 'anne',
    name: 'Anne Laure',
    gender: 'Female',
    age: 30,
    country: 'France',
    faculty: 'Nursing',
    image: 'http://voxalbaniae.com/wp-content/uploads/2018/05/4C4FE10E00000578-5735065-image-a-20_1526464022980.jpg',
    email: 'anne@gigi.com',
    password: 'passwordanne',
    passwordConfirmation: 'passwordanne'
  }])

  .then((users) => {
    console.log(`${users.length} users created!`);
  })

  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
