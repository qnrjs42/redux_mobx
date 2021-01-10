import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logIn, logOut } from './actions/user';
import userSlice from './reducers/user';
import { addPost } from './actions/post';

const axios = () => {};

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadings, setLoadings] = useState(false);
  const [errors, setErrors] = useState(false);
  const [dones, setDones] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);

  const onClick = useCallback(async () => {
    const id = new Date().valueOf();
    setLoadings((prev) => ({
      ...prev,
      [id]: { type: 'LOGIN_LOADING' }
    }));
    setLoadingIds((prev) => prev.concat(id));
    setDones(false);
    setErrors(false);
    try {
      const { data } = await axios.post('/login');
      setErrors(false);
    } catch (err) {
      setErrors(err);
    } finally {
      setLoadings((prev) => {
        const newObj = JSON.parse(JSON.stringify(prev));
        delete newObj[id];
        return newObj;
      });
      setDones(true);
    }
  }, []);

  // const onClick = useCallback(() => {
  //   dispatch(logIn({
  //     id: 'tester',
  //     password: 'password',
  //   }));
  // }, []);

  const onLogout = useCallback(() => {
    dispatch(userSlice.actions.logOut());
  }, []);

  const onAddPost = useCallback(() => {
    dispatch(addPost());
  }, []);

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    dispatch(userSlice.actions.setLoginForm({
      email,
      password,
    }));
  }, [dispatch, email, password]);

  return (
    <div>
      {user.isLoggingIn ? (
        <>로그인 중</>
      ) : user.data ? (
        <>{user.data.nickname}</>
      ) : (
        <>로그인해주세요</>
      )}
      {!user.data ? (
        <button onClick={onClick}>로그인</button>
      ) : (
        <button onClick={onLogout}>로그아웃</button>
      )}
      <button onClick={onAddPost}>게시글 작성</button>

      <form onSubmit={onSubmit}>
        <input type="email" value={email} onChange={onChangeEmail} />
        <input type="password" value={password} onChange={onChangePassword} />
      </form>
    </div>
  );
}

export default App;
