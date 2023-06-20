const {findBadgeByNumber, saveInfoToDB} = require('../helpers/badge.helper');
const base64Img = require('base64-img');
const path = require('path');

exports.findBadge = async (req, res, next) => {
    try {
        const {numberOfBadge} = req.query;

        await findBadgeByNumber(numberOfBadge, function (element) {
            res.render('findBadge2.ejs', {value: numberOfBadge, element: element, isAuthenticated: req.session.isAuthenticated,})
        });
    } catch (error) {
        next(error);
    }
};

exports.saveBadge = async (req, res, next) => {
    try {
        const {id, img} = req.body;

        base64Img.img(img, 'uploads', id, async (err) => {
            if (err) {
                console.error(err);
                return;
            }
            const result = await saveInfoToDB(id, `uploads/${id}.png`);

            res.status(200).json({image: result.img});
        });
    } catch (error) {
        next(error);
    }
};
