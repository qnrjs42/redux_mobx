## redux tooklit

```
npm i @reduxjs/toolkit
```

- redux, redux-thunk, immer, redux-devtool-extension 내장

- redux-saga에서 takeLatest, takeEvery밖에 잘 안 쓰는데 thunk 쓰는거랑 비슷함.

- throttle 같은 경우 loadsh를 사용하면 redux-thunk+loadsh 조합하면 saga 효과낼 수 있음.

- 여태 action을 만들어 왔는데 이제 tooklit이 해줌. 그래서 아래에 있는 코드는 더 이상 필요 없음.

- 그렇게 되면 action을 관리할 필요 없어지게 되고 reducer만 관리할 수 있어 코드도 짧아짐.

  ```js
  예시 action
  const logOut = () => {
    return {
      type: LOG_OUT_REQUEST,
    };
  };
  ```

  

```js
// store.js
const { configureStore } = require('@reduxjs/toolkit'); 

const reducer = require('./reducers');

const firstMiddleware = (store) => (next) => (action) => {
  console.log('action 로깅', action);
  next(action);
};

const store = configureStore({
  reducer,
  middleware: [firstMiddleware],
  devTools: process.env.NODE_env !== 'production',
});

module.exports = store;
```

```js
// reducers/index.js
const { combineReducers } = require('redux')

const userSlice = require('./user');
const postSlice = require("./post");

module.exports = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
});
```

```js
// reducers/user.js
const initialState = {
  isLoggingIn: false,
  data: null,
};

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
  // extraReducers: 비동기적(네트워크 요청 등)
  extraReducers: {},
});
```

- 여기서 파일 구조를 동기적/비동기적으로 나눌 필요가 있는데 `src/actions/`폴더 안에 비동기적 함수들을 모아둠.
- 동기적 함수들은 그냥 `reducers: {}` 부분에 넣음.

```jsx
// App.js
import userSlice from './reducers/user';

...
// userSlice에서 actions를 꺼내 logOut 함수를 실행한다.
const onLogout = useCallback(() => {
	dispatch(userSlice.actions.logOut());
}, []);
```



---

## 리덕스 미들웨어

```js
const { createStore, applyMiddleware, compose } = require("redux");


const firstMiddleware = (store) => (dispatch) => (action) => {
  console.log('action 로깅', action);
  dispatch(action);
  console.log("action 끝", action);
};

const enhancer = applyMiddleware(firstMiddleware);

const store = createStore(reducer, initialState, enhancer);

store.subscribe(() => {
  console.log('changed');
});
```

- dispatch와 reducer 사이에 동작하는게 미들웨어.
- enhancer: 미들웨어를 통해 기존 store의 기능을 추가.
- compose()는 미들웨어들을 합침(combineReducer라고 생각하면 쉬움)

```js
미들웨어 동작 순서
1. console.log('action 로깅', action)
2. dispatch(action) - store.subscribe(() => {
	console.log('changed');
});
3. console.log('action 끝', action)
```

---

## class react-redux

```jsx
import { connect } from 'react-redux';

class App {
	onClick = () => {
        this.props.dispatchLogin({
            id: 'test',
            password: 'test',
        });
    };

	onLogOut = () => {
        this.props.dispatchLogout();
    }
    
    render() {
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
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => ({
    dispatchLogIn: (data) => dispatch(logIn(data)),
    dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

- mapStateToProps: 매번 렌더링될 때마다 `mapStateToProps`함수가 실행되어 성능 이슈가 생길 수 있음.
- class 컴포넌트같은 경우 `reselect`가 필요하지만 function 컴포넌트는 필요 없다.
- 이런 경우들 때문에 리덕스는 class보단 function 컴포넌트 사용하는게 간편하다.

---

## hooks react-redux

```jsx
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
    dispatch(
      logOut()
    );
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
```

