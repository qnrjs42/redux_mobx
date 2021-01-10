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

const logOut = () => {
  return {
    type: LOG_OUT_REQUEST,
  };
};

module.exports = {
  logIn,
  logOut,
};
