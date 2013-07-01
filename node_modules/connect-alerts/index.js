var cons = require('consolidate'),
    options;

module.exports = function(opts) {
  options = opts;
  return function(req, res, next) {
    if (req.session === undefined) throw new Error('req.alert() requires session');

    req.alert = res.alert = alert.bind(req);
    if (res.locals) {
      res.locals.getAlerts = getAlerts.bind(req);
      res.locals.deleteAlerts = deleteAlerts.bind(req);
    }
    next();
  };
};

function alert(msg, type, data, render) {
  var msgs = [];

  if (this.session)
    msgs = this.session.alerts = this.session.alerts || [];

  var alertData = {
    type: type || 'info',
    msg: msg,
    data: data
  };

  // if render && options template and engine exists the alert is rendered
  if (render && options.template && options.engine) {
    cons[options.engine](options.template, {alert: alertData}, function(err, html) {
      if (err) return render(err, alertData);
      alertData.html = html;
      msgs.push(alertData);
      render(null, alertData);
    });
    return;
  }

  return msgs.push(alertData);
}

function getAlerts() {
  return this.session.alerts || [];
}

function deleteAlerts() {
  this.session.alerts = [];
}

module.exports.alert = alert;
module.exports.getAlerts = getAlerts;
module.exports.deleteAlerts = deleteAlerts;