const express= require('express');
const userController=require('./../controllers/usercontroller');
const authController= require('./../controllers/authcontroller');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.patch('/resetPassword/:token', authController.resetPassword);

// router.post('/forgotPassword', authController.forgotPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

  console.log('✅ userRoutes loaded');

module.exports = router;