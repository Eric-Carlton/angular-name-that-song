'use strict';

const conf = require('../conf/app.conf'),
  crypto = require('crypto'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({ name: 'cors.js', level: conf.log.level });

module.exports = (req, res, next) => {
  // just a simple hash of remote address and time
  req.headers.reqid = `REQ${crypto
    .createHash('md5')
    .update(new Date().getTime().toString())
    .update(req.connection.remoteAddress)
    .digest('hex')}`;

  res.header('reqid', req.header('reqid'));

  const reqLogMessage = `${req.method} request ${req.headers.reqid} to ${
    req.originalUrl
  } received`;

  if (Object.keys(req.body).length > 0) {
    log.trace(`${reqLogMessage} with body`, req.body);
  } else {
    log.trace(reqLogMessage);
  }

  const oldSend = res.send;

  res.send = function(data) {
    const resLogMessage = `Responding to ${req.method} request ${
      req.headers.reqid
    } to ${req.originalUrl} with status ${res.statusCode}`;

    if (data) {
      log.trace(`${resLogMessage} and body`, data);
    } else {
      log.trace(resLogMessage);
    }
    res.send = oldSend;
    res.send.apply(res, arguments);
  };

  next();
};
