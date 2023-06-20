const express = require("express");
const router = express.Router();

const {
    getRegistration,
    registrationUser,
    getLogin,
    loginUser
} = require('../controllers/auth.controller');

router.get("/registration", getRegistration);
router.get("/login", getLogin);

router.post("/registration", registrationUser);
router.post("/login", loginUser);

module.exports = router;