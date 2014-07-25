var utils = require('../../utils');
var api = require('./api');

module.exports = function(hoodie) {
  var account = {};

  var state = {
    // flag whether user is currently authenticated or not
    authenticated: null,
    // add events API
    events: utils.events(
      hoodie,
      account,
      'account'
    ),
    hoodie: hoodie,
    // map of requestPromises. We maintain this list to avoid sending
    // the same requests several times.
    requests: {},
    // cache for CouchDB _users doc
    userDoc: {},
    // default couchDB user doc prefix
    userDocPrefix: 'org.couchdb.user'
  };

  // public API
  [
    'authenticate',
    'hasValidSession',
    'hasInvalidSession',
    'signUp',
    'anonymousSignUp',
    'hasAccount',
    'hasAnonymousAccount',
    'signIn',
    'signOut',
    'request',
    'db',
    'fetch',
    'changePassword',
    'resetPassword',
    'checkPasswordReset',
    'changeUsername',
    'destroy'
  ].forEach(function(method) {
    account[method] = api[method].bind(null, state);
  });

  hoodie.on('remote:error:unauthenticated', api.reauthenticate.bind(null, state));

  hoodie.account = account;
};
