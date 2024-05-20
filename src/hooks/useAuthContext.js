import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    //context안에는 AuthContext에서 반환하는 state 값(user), dispatch 함수가 들어가있음.
    return context
}