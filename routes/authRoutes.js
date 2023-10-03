const {Router}=require('express')
const router=Router();
const authController=require('../controllers/authController')

router.get('/signup',authController.getSigup)

router.get('/login',authController.getLogin)

router.post('/signup',authController.postSignup)


router.post('/login',authController.postLogin)

router.get('/logout',authController.getLogout)

module.exports=router;