import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useSignIn } from './hooks/useSignIn';
import './App.css'
import Header from './components/Header';
import TextForm from './components/TextForm';
import EditTextForm from './components/EditTextForm';

const App = () => {
    const [markuptext, setMarkuptext] = useState('');
    const [markuptitle, setMarkuptitle] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [userId, setUserId] = useState(null);
    const [docId, setDocId] = useState(null);
    const { user } = useAuthContext();
    const signIn = useSignIn();

    const handleSignIn = () => {
        signIn();
    };

    return (
        <div className='container'>
            <Header />
            <main>
            {
                !user && <div class="login_area">
                            <button onClick={handleSignIn} className='btnLogin'>
                                        <img src={process.env.PUBLIC_URL + '/google_login.png'} alt="Sign in with Google" />
                                    </button>
                        </div>
            }
                <Routes>
                    <Route path='/new' element={
                        <TextForm   setMarkuptext={setMarkuptext}
                                    setMarkuptitle={setMarkuptitle}
                                    setEditMode={setEditMode}
                                    markuptext={markuptext} 
                                    markuptitle={markuptitle}
                                    editMode={editMode}
                                    userId={userId}
                                    docId={docId} />} />
                    <Route path="/memos/:userId/:docId" element={
                        <EditTextForm   markuptext={markuptext}
                                        markuptitle={markuptitle}
                                        setMarkuptext={setMarkuptext}
                                        setMarkuptitle={setMarkuptitle}
                                        setEditMode={setEditMode}
                                        userId={userId}
                                        docId={docId}
                                        setDocId={setDocId}
                                        setUserId={setUserId}
                                        editMode={editMode} />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;