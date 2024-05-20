import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import Buttons from './components/Buttons';
import TextForm from './components/TextForm';
import EditTextForm from './components/EditTextForm';

const App = () => {
    const [markuptext, setMarkuptext] = useState('');
    const [markuptitle, setMarkuptitle] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [userId, setUserId] = useState(null);
    const [docId, setDocId] = useState(null)

    return (
        <div className='container'>
            <Header />
            <main>
                <Buttons    markuptext={markuptext} 
                            markuptitle={markuptitle}
                            editMode={editMode}
                            userId={userId}
                            docId={docId} />
                <Routes>
                    <Route path='/new' element={
                    <TextForm   setMarkuptext={setMarkuptext}
                                setMarkuptitle={setMarkuptitle}
                                setEditMode={setEditMode} />} />
                    <Route path="/memos/:userId/:docId" element={
                    <EditTextForm   markuptext={markuptext}
                                    markuptitle={markuptitle}
                                    setMarkuptext={setMarkuptext}
                                    setMarkuptitle={setMarkuptitle}
                                    setEditMode={setEditMode}
                                    userId={userId}
                                    docId={docId}
                                    setDocId={setDocId}
                                    setUserId={setUserId} />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;