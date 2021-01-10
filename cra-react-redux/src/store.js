const { createStore, applyMiddleware, compose } = require("redux");
const {  composeWithDevTools } = require('redux-devtools-extension');

const reducer = require('./reducers');

const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
  comments: [],
  favorites: [],
  history: [],
  likes: [],
  followers: [],
};

const firstMiddleware = (store) => (next) => (action) => {
  console.log('action 로깅', action);
  next(action);
};

const thunkMiddleware = (store) => (next) => (action) => {
  if(typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }

  return next(action);
};

const enhancer =
  process.env.NODE_ENV === "production"
    ? compose(applyMiddleware(firstMiddleware, thunkMiddleware))
    : composeWithDevTools(applyMiddleware(firstMiddleware, thunkMiddleware));

const store = createStore(reducer, initialState, enhancer);

module.exports = store;