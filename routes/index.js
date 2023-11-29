const express = require("express");
const router = express.Router();
const userController = require('../controllers/user-controller');

router.post("/registerUser", userController.createUser);
router.get('/service/:id', userController.LocationPage)
router.post('/service/sendInfo', userController.sendInfo)
router.get('/download', userController.redirectToDownload);


module.exports = router
