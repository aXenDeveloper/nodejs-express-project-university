const jwt = require('jsonwebtoken');

const Session = require('../models/core_session');

const csrf = async (req, res, next) => {
    const sesionExist = await Session.findOne({
        token: req.header('CSRF_Token')
    });

    if (!sesionExist) return res.status(401).json({
        error: true,
        message: 'Access denied!'
    });

    try {
        const verified = jwt.verify(sesionExist.token, process.env.CSRF_TOKEN);
        req.memberID = verified;

        next();
    } catch (err) {
        res.status(400).json({
            error: true,
            message: 'Invalid token!'
        });
    }
};

module.exports = csrf;