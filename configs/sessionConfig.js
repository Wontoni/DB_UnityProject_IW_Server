const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

import MongoStore from 'connect-mongo';
// MongoDB (Session Storage)
var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.dyx5jlr.mongodb.net/?retryWrites=true&w=majority`,
	crypto: {
		secret: mongodb_session_secret
	}
});

const expireTime = 60 * 60 * 1000;

export const sessionConfig = {
  secret: node_session_secret,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    maxAge: expireTime,
    secure: false,
  },
};
