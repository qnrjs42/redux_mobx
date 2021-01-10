const { createAsyncThunk } = require('@reduxjs/toolkit');

const delay = (time, value) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(value);
  }, time);
});

// data param은 dispatch할 때의 data
const logIn = createAsyncThunk('user/logIn', async(data, thnukAPI) => {
  // thnukAPI에서는 현재 state 정보를 가져올 수 있음 | state.user.data 등등
  // const state = thnukAPI.getState();
  /**
   * 용어 변경
   * loading -> pending
   * success -> fulfilled
   * failure -> rejected
   */

  // async/await 부분에서 보통 try/catch로 감싸는데 createAsyncThunk는 감싸지 않아도 된다.
  // 에러가 발생해야 createAsyncThunk가 rejected 상태로 넘겨줌.
  // 에러가 없으면 fulfilled 상태로 넘겨줌.
  console.log(data);
  const result = await delay(500, {
    userId: 1,
    nickname: "tester",
  });

  // return resulst <- resulst가 action.payload가 된다.
  return result;
});

module.exports = {
  logIn,
};
