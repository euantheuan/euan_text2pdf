import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore.js';
import { useSignOut } from '../hooks/useSignOut.js';
import { useExportToPDF } from '../hooks/useExportToPDF.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';

const Buttons = ({ markuptext, markuptitle, editMode }) => {
    const navigate = useNavigate();
    const [btnUser, setBtnUser] = useState(false);
    const signOut = useSignOut();
    const exportToPDF = useExportToPDF(markuptext);
    const { saveToFirebase, deleteDocument, updateDocument } = useFirestore();
    const { user } = useAuthContext();

    useEffect(() => {
        if (user) {
            setBtnUser(true);
        } else {
            setBtnUser(false);
        }
    }, [user]);

    const handleSignOut = () => {
        signOut();
    };
    const handleSaveToFirebase = () => {
        if (editMode) {
            updateDocument(markuptext, markuptitle)
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
            <button onClick={() => navigate('/')}><FontAwesomeIcon icon={faPlus} /></button>
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