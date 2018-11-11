require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const {interactive, events} = require('./middleware');
const {simpleresponse} = require('./respond.js');

const app = express();

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8'); //eslint-disable-line immutable/no-mutation
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true}));
app.use(bodyParser.json({verify: rawBodyBuffer}));

/*
 * Endpoint to show the server is up for debugging
 */
app.get('/', (req, res) => {
  res.send('<h2>IRL Slackbot Server</p>');
});

/*
 * Endpoint to receive events from Slack's Events API.
 * It handles `team_join` event callbacks.
 */
app.post('/events', events);

/*
 * Endpoint to receive events from interactive message on Slack.
 * Verify the signing secret before continuing.
 */
app.post('/interactive', interactive);

/*
 * Endpoint to test stuff
 */
app.post('/test', simpleresponse);

const server = app.listen(process.env.PORT || 5000, () => {
  console.info(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  );
});
