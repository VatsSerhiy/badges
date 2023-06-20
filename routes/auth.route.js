const express = require("express");
const router = express.Router();

const {
    signIn,
    redirect,
    signOut
} = require('../controllers/auth.controller');

router.get("/signin", signIn);
router.get("/signout", signOut);

router.post("/redirect", redirect);

module.exports = router;