import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import TextForm from './components/TextForm';
import EditTextForm from './components/EditTextForm';
import { useAuthContext } from './hooks/useAuthContext';
import { useSignIn } from './hooks/useSignIn';

const App = () => {
    const [markuptext, setMarkuptext] = useState('');
    const [markuptitle, setMarkuptitle] = useState('');
    const [editMode, setEditMode] = useState(null);
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
                !user ? <div class="login_area">
                            <button onClick={handleSignIn} className='btnLogin'>
                                <img src={process.env.PUBLIC_URL + '/google_login.png'} alt="Sign in with Google" />
                            </button>
                        </div>
                    : null
            }
                <Routes>
                    <Route path='/' element={
                        <TextForm   setMarkuptext={setMarkuptext}
                                    setMarkuptitle={setMarkuptitle}
                                    setEditMode={setEditMode}
                                    markuptext={markuptext} 
                                    markuptitle={markuptitle}
                                    editMode={editMode}/>} />
                    <Route path="/memos/:userId/:docId" element={
                        <EditTextForm   markuptext={markuptext}
                                        setMarkuptext={setMarkuptext}
                                        markuptitle={markuptitle}
                                        setMarkuptitle={setMarkuptitle}
                                        editMode={editMode}
                                        setEditMode={setEditMode} />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;