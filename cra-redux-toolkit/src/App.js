import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logIn, logOut } from './actions/user';
import userSlice from './reducers/user';
import { addPost } from './actions/post';

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

  const onAddPost = useCallback(() => {
    dispatch(addPost());
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
        : <button onClick={onLogout}>로그아웃</button>}
        <button onClick={onAddPost}>게시글 작성</button>
    </div>
  );
}

export default App;
