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

