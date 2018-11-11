const {query} = require('./constants.js');
const {
  knowledgeMessage,
  interestQuestion,
  respondMessage
} = require('./constants.js');

const accept = async (user, callback_id, value, question, response_url) => {
  if (question.includes(interestQuestion)) {
    await query(
      `INSERT INTO slackbot.responses (interest, username, timestamp, topic_id)\
     VALUES($1, $2, current_timestamp, $3)`,
      [value, user, callback_id]
    );
    setTimeout(
      () =>
        respondMessage(
          knowledgeMessage(user, {
            topic: question.replace(interestQuestion, '').replace('?', ''),
            topic_id: callback_id
          })
        ),
      1000
    );
  } else {
    await query(
      `UPDATE slackbot.responses SET knowledge=$1 WHERE username=$2 AND topic_id=$3`,
      [value, user, callback_id]
    );
  }
  return {text: `Thank you! You answered ${value}`};
};

module.exports = {accept};
