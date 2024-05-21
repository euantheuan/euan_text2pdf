import React, { useState, useEffect } from 'react'
import { useFirestore } from '../hooks/useFirestore.js';
import { useSignIn } from '../hooks/useSignIn.js';
import { useSignOut } from '../hooks/useSignOut.js';
import { useExportToPDF } from '../hooks/useExportToPDF.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

const Buttons = ({ markuptext, markuptitle, editMode }) => {
    const navigate = useNavigate();
    const [btnUser, setBtnUser] = useState(false);
    const signIn = useSignIn();
    const signOut = useSignOut();
    const exportToPDF = useExportToPDF(markuptext);
    const { saveToFirebase, deleteDocument, updateDocument } = useFirestore();
    const { user } = useAuthContext();
    const { userId, docId } = useParams();

    useEffect(() => {
        if (user) {
            setBtnUser(true);
        } else {
            setBtnUser(false);
        }
    }, [user]);

    const handleSignIn = () => {
        signIn();
    };
    const handleSignOut = () => {
        signOut();
    };
    const handleSaveToFirebase = () => {
        if (editMode) {
            updateDocument(userId, docId, markuptext, markuptitle)
        } else {
            saveToFirebase(markuptext, markuptitle, user);
        }
    };
    const handleExportToPDF = () => {
        exportToPDF();
    };

    console.log('editmode', editMode)
    return (
        <div className='btn_area'>
            <button onClick={() => navigate('/new')}><FontAwesomeIcon icon={faPlus} /></button>
            <button onClick={handleExportToPDF}><FontAwesomeIcon icon={faFilePdf} /></button>
            {
                btnUser && (
                    <>
                        <button onClick={handleSaveToFirebase}><FontAwesomeIcon icon={faFloppyDisk} /></button>
                        <button onClick={deleteDocument}><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button onClick={handleSignOut}><FontAwesomeIcon icon={faRightFromBracket} /></button>
                    </>
                )
            }
        </div>
    )
}

export default Buttons