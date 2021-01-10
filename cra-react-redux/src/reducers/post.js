const {produce} = require("immer");

const initialState = [];

const postReducer = (state = initialState, action) => {
  return produce((state, draft) => {
    switch (action.type) {
      case "ADD_POST":
        draft.push(action.data);
        break;
      default:
        break;
    }
  });
  
};

module.exports = postReducer;