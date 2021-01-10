const { createSlice } = require("@reduxjs/toolkit");

const { logIn } = require('../actions/user');

const initialState = {
  isLoggingIn: false,
  data: null,
  email: '',
  password: '',
  prices: Array(100).fill().map((v, i) => (i + 1) * 100),
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
  // 외부 요청이 필요한 경우 extraReducers를 사용
  extraReducers: {
    // immer가 적용되어 있음
    [logIn.pending](state, action) {
      state.isLoggingIn = true;
    },
    [logIn.fulfilled](state, action) {
      // actions/user에서 보낸 return 값이 action.payload에 있음.
      state.data = action.payload;
      state.isLoggingIn = false;
    },
    [logIn.rejected](state, action) {
      state.data = null;
      state.isLoggingIn = false;
    },
  },
});

module.exports = userSlice;