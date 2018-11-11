const answer = require('./answer');
const onboard = require('./onboard');
const respond = require('./respond');
const signature = require('./verifySignature');

const interactive = async (req, res) => {
  const {
    user,
    callback_id,
    actions,
    original_message,
    response_url
  } = JSON.parse(req.body.payload);
  if (signature.isVerified(req)) {
    const response = await answer.accept(
      user.id,
      callback_id,
      actions[0].value,
      original_message.text,
      response_url
    );
    return res.send(response);
  } else {
    res.sendStatus(500);
  }
};

const events = async (req, res) => {
  console.log(req.body);
  switch (req.body.type) {
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.send({challenge: req.body.challenge});
      break;
    }
    case 'event_callback': {
      if (signature.isVerified(req)) {
        const event = req.body.event;
        if (
          event.is_bot ||
          event.bot_id ||
          (event.message && event.message.bot_id)
        ) {
          return res.sendStatus(200);
        }

        switch (event.type) {
          case 'team_join': {
            const {team_id, id} = event.user;
            onboard.initialMessage(team_id, id);
          }
          case 'message': {
            const {text, user} = event;
            console.log(text, user);
            await respond.respond(text, user);
          }
        }
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
      break;
    }
    default: {
      res.sendStatus(500);
    }
  }
};

module.exports = {interactive, events};
