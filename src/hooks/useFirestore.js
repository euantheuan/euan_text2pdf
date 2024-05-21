import { doc, addDoc, deleteDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from '../firebase/config.js';

// 1. state 초기화
const initState = {
    document: null,
    isPending: false,
    error: null,
    success: false,
};

// 3. 전달 받는 action에 따른 state 업데이트를 위한 함수입니다.
const storeReducer = (state, action) => {
    switch (action.type) {
        case "addDoc":
            return {
                document: action.payload
            };
        case "deleteDoc":
            return {
                document: action.payload
            };
        case "updateDoc":
            return {
                document: action.payload
            };

        default:
            return state;
    }
};

// 2. 저장할 collection의 이름/transaction-컬렉션의 이름을 받을 인자값
export const useFirestore = () => {
    const [response, dispatch] = useReducer(storeReducer, initState);
    const { userId, docId } = useParams();
    const navigate = useNavigate();


    const saveToFirebase = async (markuptext, markuptitle, user) => {
        try {
            const colRef = collection(db, 'users', user.uid, 'memos');
            const docRef = await addDoc(colRef, {
                title: markuptitle,
                desc: markuptext,
                createdAt: serverTimestamp(),
            });
            alert('저장되었습니다.');
            navigate(`/memo/${user.uid}/${docRef.id}`)
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
    };

    const updateDocument = async (userId, docId, markuptext, markuptitle) => {
        try {
            dispatch({ type: "isPending" });
            const colRef = collection(db, 'users', userId, 'memos');
            const docRef = doc(colRef, docId);
            await updateDoc(docRef, {
                title: markuptitle,
                desc: markuptext,
                createdAt: serverTimestamp()
            });
            alert('저장되었습니다.');
            dispatch({ type: "updateDoc", payload: docRef });
        } catch (e) {
            dispatch({ type: "error", payload: e.message });
            console.log(e)
        }
    };

    // collection에서 문서 삭제
    const deleteDocument = async () => {
        try {
            dispatch({ type: "isPending" });
            const colRef = collection(db, 'users', userId, 'memos');
            const docRef = doc(colRef, docId);
            if (window.confirm('삭제하시겠습니까?')) {
                await deleteDoc(docRef);
                navigate('/')
                dispatch({ type: "deleteDoc", payload: docRef });
            }
        } catch (e) {
            dispatch({ type: "error", payload: e.message });
            console.log(e)
        }
    };

    return { saveToFirebase, deleteDocument, updateDocument };
};