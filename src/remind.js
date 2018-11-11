// run this file periodically to find users who have not accepted the ToS

// find all the users who've been presented the ToS and send them a reminder to accept.
// the same logic can be applied to find users that need to be removed from the team
const remind = () => {
  try {
    const data = db.getData('/');
    Object.keys(data).forEach(team => {
      Object.keys(data[team]).forEach(user => {
        if (!data[team][user]) {
          message.channel = user;
          message.text = 'REMINDER';

          axios
            .post(`${apiUrl}/chat.postMessage`, qs.stringify(message))
            .then(result => {
              console.log(result.data);
            });
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};
