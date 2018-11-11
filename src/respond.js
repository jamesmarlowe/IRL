const qs = require('querystring');
const axios = require('axios');
const apiUrl = 'https://slack.com/api';
const {pluck, pipeP} = require('ramda');
const {
  query,
  getSlackUsers,
  insertAllUsers,
  getDBUsers,
  getDBTopic,
  askUsersAboutTopic,
  getInterestingTopics,
  getKnownTopics
} = require('./constants.js');

const message = {
  token: process.env.SLACK_ACCESS_TOKEN,
  link_names: true,
  as_user: true
};

const respond = async (text, userId) => {
  message.channel = userId;
  if (text.includes('topics?')) {
    const pgres = await query('select * from slackbot.topics');
    console.log('huh', pgres);
    message.text = pluck('topic', pgres);
    axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message));
  } else if (text.includes('setup')) {
    pipeP(
      getSlackUsers,
      insertAllUsers
    )();
  } else if (text.includes('ask')) {
    const t = await getDBTopic();
    const us = await getDBUsers();
    await askUsersAboutTopic(us, t);
  } else if (text.includes('interesting topics')) {
    message.text = await getInterestingTopics();
    axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message));
  } else if (text.includes('known topics')) {
    message.text = await getKnownTopics();
    axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message));
  } else {
    message.text = "I don't know that one.";
    axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message));
  }
};

const simpleresponse = async (req, res) => {
  res.send('done');
};

module.exports = {respond, simpleresponse};
