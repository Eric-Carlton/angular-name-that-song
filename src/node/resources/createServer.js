'use strict';

const express = require('express'),
    conf = require('../conf/app.conf'),
    glob = require('glob'),
    path = require('path'),
    bunyan = require('bunyan'),
    bodyParser = require('body-parser'),
    app = express(),
    log = bunyan.createLogger({
        name: 'createServer.js',
        level: conf.log.level
    });

module.exports = () => {
    app.disable('x-powered-by');

    app.use(bodyParser.json());

    // load middleware and add to app
    glob.sync(conf.express.middlewarePath).forEach(file => {
        log.debug('Adding middleware at', file);
        app.use(require(path.resolve(file)));
    });

    // Point static path to dist
    app.use(express.static(path.join(__dirname, conf.express.staticFolder)));

    // load route handlers
    glob.sync(conf.express.routesPath).forEach(file => {
        const router = express.Router(),
            route = require(path.resolve(file)),
            apiRoutesPrefix = conf.express.apiRoutesPrefix || '';

        route.handler(router);

        log.debug(`Adding route ${file} at path ${apiRoutesPrefix}${route.path}`);

        app.use(`${apiRoutesPrefix}${route.path}`, router);
    });

    // Catch all other routes and return the index file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, conf.express.indexPath));
    });

    // define generic error handling middleware to prevent stack trace leak
    app.use((err, req, res, next) => {
        
        log.error(
            `Unable to process ${req.method} request ${req.headers.reqid} to ${
                req.originalUrl
            }`,
            err
        );
        res.status(err.status || 500).send([{ error: err.message }]);
        next(err);
    });

    return app;
};
