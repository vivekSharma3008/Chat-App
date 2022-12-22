const express = require("express");
const {allUsers, registerUser, authUser} = require("../controllers/userControllers")
const router = express.Router();
const {protect} = require("../midlleware/authMiddleware") 

router.route('/').post(registerUser).get(protect, allUsers);

router.post('/login', authUser);

module.exports = router