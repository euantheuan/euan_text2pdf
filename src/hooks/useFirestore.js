import { doc, addDoc, deleteDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from '../firebase/config.js';

export const useFirestore = () => {
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
            navigate(`/memos/${user.uid}/${docRef.id}`)
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
    };

    const updateDocument = async ( markuptext, markuptitle) => {
        try {
            const colRef = collection(db, 'users', userId, 'memos');
            const docRef = doc(colRef, docId);
            await updateDoc(docRef, {
                title: markuptitle,
                desc: markuptext,
                createdAt: serverTimestamp()
            });
            alert('저장되었습니다.');
        } catch (e) {
            console.log(e)
        }
    };

    // collection에서 문서 삭제
    const deleteDocument = async () => {
        try {
            const colRef = collection(db, 'users', userId, 'memos');
            const docRef = doc(colRef, docId);
            if (window.confirm('삭제하시겠습니까?')) {
                await deleteDoc(docRef);
                navigate('/')
            }
        } catch (e) {
            console.log(e)
        }
    };

    return { saveToFirebase, deleteDocument, updateDocument };
};