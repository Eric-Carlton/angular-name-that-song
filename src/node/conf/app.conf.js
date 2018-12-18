'use strict';

module.exports = {
    express: {
        port: 3000,
        middlewarePath: './src/node/middleware/**/*.js',
        routesPath: './src/node/routes/**/*.js',
        apiRoutesPrefix: '/api',
        staticFolder: '../../../dist',
        indexPath: '../../../dist/index.html'
    },
    cors: {
        allowedOrigins: ['http://localhost:4200'],
        exposedHeaders: ['reqid'],
        allowedHeaders: ['content-type'],
        allowedMethods: ['GET'],
        credentials: false
    },
    log: {
        level: 'trace'
    }
};
