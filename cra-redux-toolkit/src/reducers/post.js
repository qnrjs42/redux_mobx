const { createSlice } = require('@reduxjs/toolkit');
const { addPost } = require('../actions/post');

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
  reducers: {
    clearPost(state, action) {
      state.data = [];
    },
  },
  // extraReducers: 비동기적
  extraReducers: (builder) => builder
    // builder의 addCase는 typescript의 타입 추론 사용할 때 편하다.
    .addCase(addPost.pending, (state, action) => {
      // state 자체를 바뀌어야할 경우(불변성이 깨질 때)
      // return state를 해주면 된다.
      // state = 123;
      // return state;
    })
    .addCase(addPost.fulfilled, (state, action) => {
      state.data.push(action.payload);
    })
    .addCase(addPost.rejected, (state, action) => {})
    // addMatcher는 여러 액션들 중 중복 코드 발생할 때 처리
    .addMatcher((action) => {
        return action.type.includes('/pending');
      }, (state, action) => {
        state.isLoading = true;
      }
    )
    .addDefaultCase(() => {}),
});

module.exports = postSlice;