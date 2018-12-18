'use strict';

const { query, validationResult } = require('express-validator/check');

class HelloRoute {
    constructor(router) {
        router.get('/', [
            query('name')
            .exists()
            .withMessage('name query param must be provided')
            .isLength({min: 1, max: 50})
            .withMessage('name query param must be between 1 and 50 characters')
        ], this.getHelloMessage);
    }

    getHelloMessage(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        } else {
            return res.json({ msg: `Hello, ${req.query.name}!`});
        }   
    }
}

module.exports = {
    path: '/hello',
    handler: router => new HelloRoute(router)
}