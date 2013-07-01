
## Usage

### res.alert(msg <String> (, type:String, data:Object, render:Function))

    res.alert('This is a message', 'error');

Add alert to req.session.alerts array.

Default type : 'info'.

#### Optional callback

Optional render callback signature: function(err, alert)

Returns the alert object with an html property, rendering is done with the template and engine option.

    res.alert('This is a message', 'info', {}, function(err, alert) {
      res.json(alert);
    });

Does NOT add the alert to req.session.alerts array.

### Methods exposed into res.locals

getAlerts()

deleteAlerts()

## Setup and options
    var alerts = require('connect-alerts');

    app.use(alerts({
      template: __dirname + '/app/views/shared/alert.jade',
      engine: 'jade'
    }));

engine: use [consolidate.js](https://github.com/visionmedia/consolidate.js), actually only jade dependency is added, additional engines may be easily supported by adding them as dependencies.

### jade templates examples

Template alerts.jade

    div#alerts
      - var alerts = getAlerts();
      each alert in alerts
        include alert
      - deleteAlerts();

Template alert.jade

    div(class='alert alert-' + alert.type)!= alert.msg
          a.close(data-dismiss="alert", href="#") &times;


## License

MIT