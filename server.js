var Hapi = require('hapi');
var server = new Hapi.Server(process.env.PORT || 5000);

server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: {
      path: 'public',
      listing: true
    }
  }
});

server.route({
  method: 'POST',
  path: '/api/send',
  handler: function (req, res) {
    if(req.headers.cookie){
      var api_key = 'mailgun-api-key';
      var domain = 'mailgun-domain';
      var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

      var data = {
        from: req.payload.email,
        to: 'your_email_address',
        subject: 'Message from ' + req.payload.email,
        text: req.payload.message
      };
      mailgun.messages().send(data, function (error, body) {
        console.log(body);
      });
    }
  }
});

server.start(function() {
  console.log('Server running at: ', server.info.uri);
});
