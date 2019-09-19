const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/user');

const { verifyPass } = require('./config/keys');

// Get All Users
exports.users_get_index = (req, res) => {
  User.find()
    .select('name email date')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        users: docs
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};

// Login Page
exports.users_get_login = (req, res) => res.render('users/login');

// Register Page
exports.users_get_register = (req, res) => res.render('users/register');

// Register
exports.users_post_register = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('users/register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          type: null,
          userInfo: {}
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
};

// Login
exports.users_post_login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

// Logout
exports.users_get_logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
};

// Ser User Type
exports.users_get_setType = (req, res) => {
  if (req.params.type === "applicant" || req.params.type === "employer") {
    if (req.user.type === "applicant" || req.user.type === "employer") {
      res.redirect('/dashboard');
    } else {
      User.findByIdAndUpdate(req.user.id, { $set: { type: req.params.type } })
        .exec()
        .then(result => {
          res.redirect('/dashboard');
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.message });
        });
    }
  } else {
    res.render('notfound');
  }
};

// Ser User Info
exports.users_post_userInfo = (req, res) => {
  let setProps = {
    userInfo: req.body
  };
  if (req.user.type === "employer") {
    setProps.userInfo.verified = false;
  }
  User.findByIdAndUpdate(req.user.id, { $set: setProps })
    .exec()
    .then(result => {
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};

// Verify User
exports.users_post_verifyUser = (req, res) => {
  if (req.body.password !== verifyPass ) {
    res.status(401).json({
      message: "Auth Failed"
    });
  } else {
    User.findByIdAndUpdate(req.body.userId, { "userInfo.verified": true })
      .exec()
      .then(result => {
        res.status(200).json({ message: "User Verified!" });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.message });
      })
  }
};
