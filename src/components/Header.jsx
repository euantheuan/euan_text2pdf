import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext.js';

const Header = () => {
    const navigate = useNavigate();
    const [memos, setMemos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthContext();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const memosCollectionRef = collection(db, 'users', user.uid, 'memos');
                const q = query(memosCollectionRef, orderBy("createdAt", "desc"));
                const unsubscribeSnapshot = onSnapshot(
                    q,
                    (snapshot) => {

                        const memosData = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setMemos(memosData);
                        setIsLoading(false);
                    },
                    (error) => {
                        console.error('Error fetching memos:', error);
                        setIsLoading(false);
                    }
                );

                return () => {
                    unsubscribeSnapshot();
                };
            } else {
                setIsLoading(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (isLoading) {
        return <header>
                    <div className='loading'>로딩 중...</div>
                </header>;
    }

    return (
        <header>
            <div className="title_area">
                <h1>마크다운 텍스트 에디터</h1>
                {
                    user    ? <h2>로그인 정보: {user.email}</h2>
                            : <h2>로그인 정보가 없습니다.</h2>
                }
            </div>
            <div className='list_area'>
            {memos.map((memo, idx) => (
                <div    className='list'
                        key={idx}
                        onClick={() => navigate(`/memos/${user.uid}/${memo.id}`)} >
                    <h3> {memo.title} </h3>
                    <p>{memo.desc}</p>
                    <span>
                            {memo.createdAt && memo.createdAt.toDate
                            ? new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            }).format(memo.createdAt.toDate())
                            : ''}
                        </span>
                </div>
            ))}
            </div>
        </header>
    );
};

export default Header;