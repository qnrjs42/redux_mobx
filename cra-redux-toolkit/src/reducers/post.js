const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  data: [],
};

// const postReducer = (state = initialState, action) => {
//   return produce((state, draft) => {
//     switch (action.type) {
//       case "ADD_POST":
//         draft.push(action.data);
//         break;
//       default:
//         break;
//     }
//   });
// };

const postSlice = createSlice({
  // name은 reducer 이름이라고 생각하면 쉬움
  name: "post",
  initialState,
  // reducers: 동기적
  reducers: {},
  // extraReducers: 비동기적
  extraReducers: {},
});

module.exports = postSlice;