const {produce} = require('immer');

const initialState = {
  isLoggingIn: false,
  data: null,
};

const userReducer = (state = initialState, action) => {
  return produce((state, draft) => {
    switch (action.type) {
      case "LOG_IN_REQUEST":
        draft.data = null;
        draft.isLoggingIn = true;
        break;
      case "LOG_IN_SUCCESS":
        draft.data = action.data;
        draft.isLoggingIn = false;
        break;
      case "LOG_IN_FAILURE":
        draft.data = null;
        draft.isLoggingIn = true;
        break;
      case "LOG_OUT":
        draft.data = null;
        break;
      default:
        break;
    }
  });
};

module.exports = userReducer;