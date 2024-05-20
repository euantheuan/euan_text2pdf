import React, { useState } from 'react';
import { auth, db, provider } from '../firebase.js';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import html2pdf from 'html2pdf.js';


const Markdown = () => {

    const [markupText, setMarkupText] = useState('');
    const [user, setUser] = useState(null);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };

    const saveToFirebase = async () => {
        if (user) {
            try {
                await addDoc(collection(db, 'users', user.uid, 'memos'), {
                    text: markupText,
                    createdAt: serverTimestamp(),
                });
                console.log('Saved to Firebase successfully.');
            } catch (error) {
                console.error('Error saving to Firebase:', error);
            }
        } else {
            console.log('User not logged in. Please log in to save the markup.');
        }
    };

    const exportToPDF = async () => {

        const htmlContent = marked(markupText);
        const element = document.createElement('div');
        element.innerHTML = htmlContent;

        const options = {
            margin: [30, 25, 25, 25],
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
        };

        try {
            const pdfBlob = await html2pdf().from(element).set(options).toPdf().output('blob');
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(pdfBlob);
            downloadLink.download = 'document.pdf';
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
            alert('파일을 저장했습니다.')
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('오류가 발생했습니다.')
        }
    };

    return (
        <div>
            <textarea value={markupText}
                onChange={(e) => {setMarkupText(e.target.value); saveToFirebase(); }}
                className='typehere' />
            <button onClick={exportToPDF}>Export to PDF</button>
            {user ? (
                <>
                    <button onClick={handleLogOut}>Log Out</button>
                    <button onClick={saveToFirebase}>Save to Firebase</button>
                </>
            ) : (
                <button onClick={handleGoogleLogin}><img src={process.env.PUBLIC_URL + '/google_login.png'} alt="Google Login" /></button>
            )}
        </div>
    );
};

export default Markdown;