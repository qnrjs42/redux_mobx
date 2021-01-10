import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, logOut } from './actions/user';
import userSlice from './reducers/user';

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(logIn({
      id: 'tester',
      password: 'password',
    }));
  }, []);

  const onLogout = useCallback(() => {
    dispatch(userSlice.actions.logOut());
  }, []);

  return (
    <div>
      {user.isLoggingIn ? (
        <>로그인 중</>
      ) : user.data ? (
        <>{user.data.nickname}</>
      ) : (
        <>로그인해주세요</>
      )}
      {!user.data
        ? <button onClick={onClick}>로그인</button>
        : <button onClick={onLogout}>로그아웃</button>
      }
    </div>
  );
}

export default App;
