const { createAsyncThunk } = require('@reduxjs/toolkit');

const logIn = createAsyncThunk('user/logIn', async(data, thnukAPI) => {
  // thnukAPI에서는 현재 state 정보를 가져올 수 있음 | state.user.data 등등
  // const state = thnukAPI.getState();
  /**
   * 용어 변경
   * loading -> pending
   * success -> fulfulled
   * failure -> rejected
   */
});

const logIn = (data) => { // async action creator
  return (dispatch, getState) => {
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(
          logInSuccess({
            userId: 1,
            nickname: "tester",
          })
        );
      }, 2000);
    } catch (err) {
      dispatch(logInFailure(err));
    }
  }
}

const LOG_IN_REQUEST = "LOG_IN_REQUEST";
const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
const LOG_IN_FAILURE = "LOG_IN_FAILURE";
const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";



const logInRequest = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  }
};

const logInSuccess = (data) => {
  return {
    type: LOG_IN_SUCCESS,
    data,
  }
}

const logInFailure = (err) => {
  return {
    type: LOG_IN_FAILURE,
    err,
  };
};

module.exports = {
  logIn,
};
