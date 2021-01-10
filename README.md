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
const { configureStore, getDefaultMiddleware } = require('@reduxjs/toolkit'); 

const reducer = require('./reducers');

const firstMiddleware = (store) => (next) => (action) => {
  console.log('action 로깅', action);
  next(action);
};

const store = configureStore({
  reducer,
  middleware: [firstMiddleware, ...getDefaultMiddleware()],
  devTools: process.env.NODE_ENV !== "production",
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



### createAsyncThunk 비동기 처리

```js
// actions/user.js
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
```

```js
// reducers/user.js
const { createSlice } = require("@reduxjs/toolkit");

const { logIn } = require('../actions/user');

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
```



```js
chrome redux devtools에서
logIn/pending, logIn/fulfulled의 Action 상태를 보면

// pending
meta: {
	args: {
		id: "tester",
		password: "password",
	},
	requestId: "ES-7uAbQt1G7aOCypRrFl"
	requestStatus: "pending"
}

// fulfilled
meta: {
	args: {
		id: "tester",
		password: "password",
	},
	requestId: "ES-7uAbQt1G7aOCypRrFl"
	requestStatus: "fulfilled"
}
```

- 여기서 `meta.args`는 요청을 보낼 때의 값이다.

  ```js
  const onClick = useCallback(() => {
      dispatch(logIn({
        id: 'tester',
        password: 'password',
      }));
  }, []);
  ```

- `requestId`는 하나의 요청에 누구의 값인지 알 수 있게 판단.



### extraReducers builder (addCase, addMatcher)

```js
// reducers/post.js
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
```



### 리덕스를 쓰지 말아야 할 때 (인풋)

```jsx
// App.js

1. const user = useSelector((state) => state.user);
2. const { email, password } = useSelector((state) => state.user);
3. const email = useSelector((state) => state.user.email);
   const password = useSelector((state) => state.user.password);
```

- 1번 코드와 2번 코드는 비슷하게 동작한다. user 중 어떤 값이라도 바뀌면 렌더링이 된다.

- 3번 코드는 `user.email`과 `user.password`만 바뀌면 렌더링이 된다.

성능 최적화는 처음부터 생각하면 힘들고 나중에 성능 이슈가 생겼을 때 그 부분을 최적화하는게 정신건강에 좋다.



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

