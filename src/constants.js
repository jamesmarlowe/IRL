const {Client} = require('pg');
const axios = require('axios');
const qs = require('querystring');
const {
  pipe,
  pipeP,
  prop,
  chain,
  converge,
  assoc,
  path,
  pick,
  identity,
  map,
  filter,
  pluck
} = require('ramda');

const apiUrl = 'https://slack.com/api';

const query = async (sql, args) => {
  const client = new Client();
  await client.connect();
  const res = await client.query(sql, args);
  await client.end();
  return res.rows;
};

const getSlackUsers = () =>
  pipeP(
    () =>
      axios.post(
        `${apiUrl}/users.list`,
        qs.stringify({token: process.env.SLACK_ACCESS_TOKEN})
      ),
    path(['data', 'members']),
    chain(
      pipe(
        converge(assoc('email'), [path(['profile', 'email']), identity]),
        pick(['id', 'email'])
      )
    ),
    filter(prop('email'))
  )();

const insertAllUsers = async users => {
  const userVals = map(
    u => `('${u.id}', current_timestamp, '${u.email}')`,
    users
  );
  await query(
    `INSERT INTO slackbot.people(username, last_update, user_email) VALUES ${userVals.join()} ON CONFLICT (username) DO NOTHING;`
  );
};

const getDBUsers = pipeP(
  () => query(`SELECT username FROM slackbot.people;`),
  pluck('username')
);

const getDBTopic = pipeP(
  () =>
    query(
      `SELECT topic, topic_id FROM slackbot.topics ORDER BY RANDOM() LIMIT 1`
    ),
  path([0])
);

const getInterestingTopics = pipeP(
  () =>
    query(
      `SELECT topic FROM slackbot.topics WHERE topic_id IN (SELECT topic_id from (SELECT topic_id, COUNT(*) from (SELECT topic_id, username FROM slackbot.responses WHERE interest=5) as A GROUP BY topic_id) as B WHERE count >=2);`
    ),
  pluck('topic')
);

const getKnownTopics = pipeP(
  () =>
    query(
      `SELECT topic FROM slackbot.topics WHERE topic_id IN (SELECT topic_id from (SELECT topic_id, COUNT(*) from (SELECT topic_id, username FROM slackbot.responses WHERE knowledge=5) as A GROUP BY topic_id) as B WHERE count >=2);`
    ),
  pluck('topic')
);

const getSlackChannels = axios.post(
  `${apiUrl}/channels.list`,
  qs.stringify(message)
);

const interestQuestion = 'How interested are you in ';

const message = (user, topic) => ({
  token: process.env.SLACK_ACCESS_TOKEN,
  link_names: true,
  as_user: true,
  channel: user,
  text: `${interestQuestion} ${topic.topic}?`,
  attachments: JSON.stringify([
    {
      text: '1 is none, 5 is all',
      callback_id: topic.topic_id,
      color: '#3060f0',
      actions: [
        {name: topic.topic_id, text: '1', type: 'button', value: '1'},
        {name: topic.topic_id, text: '2', type: 'button', value: '2'},
        {name: topic.topic_id, text: '3', type: 'button', value: '3'},
        {name: topic.topic_id, text: '4', type: 'button', value: '4'},
        {name: topic.topic_id, text: '5', type: 'button', value: '5'}
      ]
    }
  ])
});

const knowledgeMessage = (user, topic) =>
  assoc(
    'text',
    `How much do you know about ${topic.topic}?`,
    message(user, topic)
  );

const respondMessage = message =>
  axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message));

const askUsersAboutTopic = (users, topic) =>
  Promise.all(
    map(
      u =>
        axios.post(
          `${apiUrl}/chat.postMessage`,
          qs.stringify(message(u, topic))
        ),
      users
    )
  );

module.exports = {
  apiUrl,
  query,
  getSlackUsers,
  insertAllUsers,
  getDBUsers,
  getDBTopic,
  askUsersAboutTopic,
  knowledgeMessage,
  interestQuestion,
  respondMessage,
  getInterestingTopics,
  getKnownTopics
};
