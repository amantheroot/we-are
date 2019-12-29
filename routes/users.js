const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '--' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported File Type'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 100
  },
  fileFilter
 });

// Load User model
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

const UsersController = require('../controllers/users');

// Get All Users
router.get('/', UsersController.users_get_index);

// Login Page
router.get('/login', forwardAuthenticated, UsersController.users_get_login);

// Register Page
router.get('/register', forwardAuthenticated, UsersController.users_get_register);

// Register
router.post('/register', UsersController.users_post_register);

// Login
router.post('/login', UsersController.users_post_login);

// Logout
router.get('/logout', UsersController.users_get_logout);

// Set User Type
router.get('/setType/:type', ensureAuthenticated, UsersController.users_get_setType);

// Set User Info
router.post('/userInfo', UsersController.users_post_userInfo);

// Verify User
router.post('/verifyUser', UsersController.users_post_verifyUser);

// Upload Video Resume
router.post('/uploadVideo', upload.single('videoResume'), UsersController.users_post_uploadVideo);

module.exports = router;
