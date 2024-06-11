// Auth
const readline = require('readline-sync');

const settings = require('./appSettings');
const graphHelper = require('./graphHelper');

function initializeGraph(settings) {
  graphHelper.initializeGraphForUserAuth(settings, (info) => {
    // Display the device code message to
    // the user. This tells them
    // where to go to sign in and provides the
    // code to use.
    console.log(info.message);
  });
}

async function greetUserAsync() {
  try {
    const user = await graphHelper.getUserAsync();
    console.log(`Hello, ${user?.displayName}!`);
    // For Work/school accounts, email is in mail property
    // Personal accounts, email is in userPrincipalName
    console.log(`Email: ${user?.mail ?? user?.userPrincipalName ?? ''}`);
  } catch (err) {
    console.log(`Error getting user: ${err}`);
  }
}

async function sendMailAsync(emailSubject, emailBody, userEmail) {
  try {

    // const userEmail = user?.mail ?? user?.userPrincipalName;
    console.log(`Sending mail to ${userEmail}...`);

    if (!userEmail) {
      console.log('Couldn\'t get your email address, canceling...');
      return;
    }
    console.log('Antes de Mail sent.');
    await graphHelper.sendMailAsync(emailSubject, emailBody, userEmail);

    console.log('Mail sent.');
  } catch (err) {
    console.log(`Error sending mail: ${err}`);
  }
}

async function startEmail() {
  initializeGraph(settings);
  await greetUserAsync();
}


function trimFields(body) {
  const result = {};

  for (const key in body) {
      const value = body[key];
      if (typeof value === 'string') {
          result[key] = value.trim();
      } else {
          result[key] = value;
      }
  }

  return result;
}

function trimInputMiddleware() {
  return (handler) => {
    return (req, res, next) => {
      req.body = trimFields(req.body);
      handler(req, res, next);
    };
  };
};

module.exports = {
  initializeGraph,
  greetUserAsync,
  sendMailAsync,
  startEmail,
  trimInputMiddleware
}