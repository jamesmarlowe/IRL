const qs = require('querystring');
const axios = require('axios');
const JsonDB = require('node-json-db');
const {apiUrl} = require('./constants.js');

const message = {
  token: process.env.SLACK_ACCESS_TOKEN,
  link_names: true,
  as_user: true,
  text: 'Welcome to Daugherty!',
  attachments: JSON.stringify([
    {
      title: 'What is IRL?',
      text:
        'IRL is a helpful bot that helps consultants find friends and find the right clients.',
      color: '#74c8ed'
    },
    {
      title: 'Line of Service',
      text:
        'I need to know a few things about you to help our client managers. Which line of service are you in?',
      callback_id: 'line-of-service',
      color: '#3060f0',
      actions: [
        {name: 'los', text: 'Software', type: 'button', value: 'software'},
        {name: 'los', text: 'Business', type: 'button', value: 'business'},
        {name: 'los', text: 'Data', type: 'button', value: 'data'}
      ]
    }
  ])
};

const initialMessage = async (teamId, userId) => {
  let data = false;
  data = db.getData(`/${teamId}/${userId}`);
  if (!data) {
    message.channel = userId;
    await axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message));
  } else {
    console.log('Already onboarded');
  }
};

module.exports = {initialMessage};
