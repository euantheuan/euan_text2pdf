import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Buttons from './Buttons';

const EditTextForm = ({ editMode, setEditMode, setMarkuptitle, setMarkuptext, markuptext, markuptitle, setUserId, setDocId }) => {
    const { userId, docId } = useParams();

    useEffect(() => {
        setUserId(userId);
        setDocId(docId);
        const fetchMemoDetails = async () => {
            try {
                const memoRef = doc(db, 'users', userId, 'memos', docId);
                const memoSnapshot = await getDoc(memoRef);

                if (memoSnapshot.exists()) {
                    const memoData = memoSnapshot.data();
                    setMarkuptitle(memoData.title);
                    setMarkuptext(memoData.desc);
                } else {
                    console.log('Memo not found');
                }
            } catch (error) {
                console.error('Error fetching memo details:', error);
            }
        };

        fetchMemoDetails();
    }, [userId, docId]);

    useEffect(() => {
        setEditMode(true);
    }, [setEditMode]);

    return (
        <>
        <Buttons    markuptext={markuptext} 
                    markuptitle={markuptitle}
                    editMode={editMode}
                    userId={userId}
                    docId={docId} />
        <div className="text_area">
            <input
                type="text"
                placeholder="이곳에 제목을 입력하세요."
                className="text_title"
                value={markuptitle}
                onChange={(e) => setMarkuptitle(e.target.value)}
            />
            <textarea
                value={markuptext}
                onChange={(e) => setMarkuptext(e.target.value)}
                placeholder="이곳에 마크다운 문법을 이용해 본문을 입력하세요."
                className="text_desc"
            />
        </div></>
    );
};

export default EditTextForm;