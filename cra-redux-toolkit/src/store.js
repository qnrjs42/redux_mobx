const { configureStore, getDefaultMiddleware } = require('@reduxjs/toolkit'); 

const reducer = require('./reducers');

const firstMiddleware = (store) => (next) => (action) => {
  console.log('action 로깅', action);
  next(action);
};

const store = configureStore({
  reducer,
  middleware: [firstMiddleware, ...getDefaultMiddleware()],
  devTools: process.env.NODE_ENV !== "production",
});

module.exports = store;