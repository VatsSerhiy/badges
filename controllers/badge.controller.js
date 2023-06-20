const {findBadgeByNumber, saveInfoToDB} = require('../helpers/badge.helper');

exports.findBadge = async (req, res, next) => {
    try {
        const {numberOfBadge} = req.query;

        if (numberOfBadge === undefined) {
            if (req.session.username !== undefined) {
                res.render('findBadge2.ejs', {item: false, token: true})
            } else {
                res.render('findBadge2.ejs', {item: false, token: false})
            }
        } else {
            if (req.session.username !== undefined) {
                await findBadgeByNumber(numberOfBadge, function (element) {
                    res.render('findBadge2.ejs', {item: element, token: true})
                });
            } else {
                await findBadgeByNumber(numberOfBadge, function (element) {
                    res.render('findBadge2.ejs', {item: element, token: false})
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
