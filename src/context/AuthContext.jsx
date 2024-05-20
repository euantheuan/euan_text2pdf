import { createContext, useEffect, useReducer } from "react";
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/config";

//context 객체를 생성
const AuthContext = createContext();

//인증상태를 업데이트하는 로직 -> action.type에 따라 상태를 어떻게 보여줄지 결정
const authReducer = (state, action) => {

    //AuthContenxt.js에서 dispatch 함수가 실행될 때 전달받을 수 있는 action의 타입을 추가
    switch (action.type) {
        case 'login':
            return { ...state, user: action.payload }
        case 'logout':
            return { ...state, user: null }

        //현재 로그인상태인 유저
        case 'isAuthReady':
            return { ...state, user: action.payload, isAuthReady: true }
        default:
            return state;
    }
}
//context를 공유할 범위
const AuthContextProvider = ({ children }) => {
    //유저정보를 관리
    //useReducer를 사용해서 authReducer함수와 초기상태(user: null)
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        //파이어베이스로부터 유저정보를 받아오면 isAuthReady-> true/true가 된 다음에 화면 렌더링이 실행
        isAuthReady: false
    })
    //console.log('user state :', state)

    //user의 상태를 계속 체크하는 기능
    //매개변수로 []를 입력하면 처음 렌더링 1번만 업데이트
    //매개변수로 [state명]-> state 상태가 업데이트될때마다 렌더링
    useEffect(() => {
        //새로고침 후 초기에 딱 한번 실행하면 이후에는 유저 state를 관찰하지 않음
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            dispatch({ type: "isAuthReady", payload: user })
        });
        return unSubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }} >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }