'use strict';

const cors = require('cors'),
  conf = require('../conf/app.conf');

module.exports = cors({
  origin: conf.cors.allowedOrigins,
  exposedHeaders: conf.cors.exposedHeaders,
  allowedHeaders: conf.cors.allowedHeaders,
  methods: conf.cors.allowedMethods,
  credentials: conf.cors.credentials
});
