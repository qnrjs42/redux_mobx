const { configureStore } = require('@reduxjs/toolkit'); 

const reducer = require('./reducers');

const firstMiddleware = (store) => (next) => (action) => {
  console.log('action 로깅', action);
  next(action);
};

const store = configureStore({
  reducer,
  middleware: [firstMiddleware],
  devTools: process.env.NODE_env !== 'production',
});

module.exports = store;