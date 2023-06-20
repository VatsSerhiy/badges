const {findBadgeByNumber, saveInfoToDB} = require('../helpers/badge.helper');

exports.findBadge = async (req, res, next) => {
    try {
        const {numberOfBadge} = req.query;

        if (numberOfBadge === undefined) {
            if (req.session.username !== undefined) {
                res.render('findBadge2.ejs', {item: false, token: true, isAuthenticated: req.session.isAuthenticated,})
            } else {
                res.render('findBadge2.ejs', {item: false, token: false, isAuthenticated: req.session.isAuthenticated,})
            }
        } else {
            if (req.session.username !== undefined) {
                await findBadgeByNumber(numberOfBadge, function (element) {
                    res.render('findBadge2.ejs', {item: element, token: true, isAuthenticated: req.session.isAuthenticated,})
                });
            } else {
                await findBadgeByNumber(numberOfBadge, function (element) {
                    res.render('findBadge2.ejs', {item: element, token: false, isAuthenticated: req.session.isAuthenticated,})
                });
            }
        }
    } catch (error) {
        next(error);
    }
};

exports.saveBadge = async (req, res, next) => {
    try {
        const {number, fullname, course, date, end_date} = req.body;

        await saveInfoToDB(number, fullname, course, date, end_date);
    } catch (error) {
        next(error);
    }
};
