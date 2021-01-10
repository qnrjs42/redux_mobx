const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isLoggingIn: false,
  data: null,
};

// const userReducer = (state = initialState, action) => {
//   return produce((state, draft) => {
//     switch (action.type) {
//       case "LOG_IN_REQUEST":
//         draft.data = null;
//         draft.isLoggingIn = true;
//         break;
//       case "LOG_IN_SUCCESS":
//         draft.data = action.data;
//         draft.isLoggingIn = false;
//         break;
//       case "LOG_IN_FAILURE":
//         draft.data = null;
//         draft.isLoggingIn = true;
//         break;
//       case "LOG_OUT":
//         draft.data = null;
//         break;
//       default:
//         break;
//     }
//   });
// };

const userSlice = createSlice({
  // name은 reducer 이름이라고 생각하면 쉬움
  name: "user",
  initialState,
  // reducers: 동기적
  reducers: {
    // state는 initialState 구조 따라간다.
    logOut(state, action) {
      state.data = null;
    },
  },
  // extraReducers: 비동기적
  extraReducers: {},
});

module.exports = userSlice;