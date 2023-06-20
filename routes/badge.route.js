const express = require("express");
const router = express.Router();

const {
    findBadge,
    saveBadge
} = require('../controllers/badge.controller');

router.get("/findBadge", findBadge);

router.post("/save", saveBadge);
router.get("/save", async (req, res, next) => {
    try {
        res.redirect('/findBadge');
    } catch (error) {
        next(error);
    }
});

module.exports = router;