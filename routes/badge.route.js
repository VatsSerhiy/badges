const express = require("express");
const router = express.Router();

const {
    findBadge,
    saveBadge
} = require('../controllers/badge.controller');

router.get("/findBadge", findBadge);

router.get("/create", async (req, res, next) => {
    // if (req.session.isAuthenticated) {
    //     res.render('index.ejs', {isAuthenticated: req.session.isAuthenticated});
    // } else res.redirect('/auth/signin');
    res.render('index.ejs', {isAuthenticated: req.session.isAuthenticated});
});

router.post("/save", saveBadge);
router.get("/save", async (req, res, next) => {
    try {
        res.redirect('/findBadge');
    } catch (error) {
        next(error);
    }
});

module.exports = router;