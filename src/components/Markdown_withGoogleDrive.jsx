import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import html2pdf from 'html2pdf.js';

import { gapi } from 'gapi-script';

const firebaseConfig = {
    apiKey: "AIzaSyBAb6DiKR284Y6c5w3lEPtIkiQDXecAC5M",
    authDomain: "markdown-text-editor.firebaseapp.com",
    databaseURL: "https://markdown-text-editor-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "markdown-text-editor",
    storageBucket: "markdown-text-editor.appspot.com",
    messagingSenderId: "1096665667740",
    appId: "1:1096665667740:web:ef149ffeda396b3badb559",
    measurementId: "G-KQJ184BJC2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
provider.addScope('https://www.googleapis.com/auth/drive.file');

const CLIENT_ID = '1096665667740-b5sm51v94uhauts3kl3o2ngjsitmrges.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBAb6DiKR284Y6c5w3lEPtIkiQDXecAC5M';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive';



const Markdown = () => {
    const [markupText, setMarkupText] = useState('');
    const [user, setUser] = useState('');
    const [gapiLoaded, setGapiLoaded] = useState(false);
    const [gisInited, setGisInited] = useState(false);

    useEffect(() => {
        const initializeGapi = async () => {
            gapi.load('client:auth2', async () => {
                await gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: [DISCOVERY_DOC],
                    clientId: CLIENT_ID,
                    scope: SCOPES,
                });
                setGapiLoaded(true);
                gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                    setGisInited(isSignedIn);
                });
            });
        };
        initializeGapi();
    }, []);
    

    useEffect(() => {
        if (gapiLoaded) {
            gapi.auth2.init({
                client_id: CLIENT_ID,
                scope: SCOPES,
            }).then(() => {
                setGisInited(true);
                // Add a listener to detect sign-in state changes
                gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                    setGisInited(isSignedIn);
                });
            }).catch((error) => {
                console.error('Error initializing Google API client:', error);
            });
        }
    }, [gapiLoaded]);

    const handelGoogleLogin = () => {

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                setUser(user);
                const idTokenResult = await user.getIdTokenResult();
                const accessToken = idTokenResult.token;
                console.log(accessToken)
            })
            .catch((error) => {
                console.error('Error during Google sign-in:', error);
            });

    };
    const handleLogOut = () => {
        signOut(auth)
            .then(() => {
                console.log('Signed out successfully.');
            })
            .catch((error) => {
                alert('An error occurred.');
                console.error(error);
            });
    };

    const saveToFirebase = async () => {
        if (user) {
            const userId = user.uid;
            await addDoc(collection(db, 'users', userId, 'memos'), {
                text: markupText,
                createdAt: serverTimestamp()
            });
            console.log('Firebase에 저장되었습니다.')
        } else {
            console.log('User not logged in. Please log in to save the markup.');
        }
    };

    const exportToPDF = async () => {
        const markdownContent = markupText;
        const htmlContent = marked(markdownContent);

        console.log(htmlContent);

        const element = document.createElement('div');
        element.innerHTML = htmlContent;

        const options = {
            margin: [30, 25, 25, 25],
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
        };

        try {
            const pdfBlob = await html2pdf().from(element).set(options).toPdf().output('blob');

            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(pdfBlob);
            downloadLink.download = 'document.pdf';

            // Trigger the download
            downloadLink.click();

            // Clean up the URL object
            URL.revokeObjectURL(downloadLink.href);

            alert('Markdown and PDF saved successfully.');
        } catch (err) {
            console.log(err);
        }
    };

    const uploadToGoogleDrive = async () => {
        if (user) {
            const markdownContent = markupText;
            const htmlContent = marked(markdownContent);

            const fileMetadata = {
                name: 'document.pdf',
                mimeType: 'application/pdf',
                parents: ['root'],
            };

            const element = document.createElement('div');
            element.innerHTML = htmlContent;

            const options = {
                margin: [30, 25, 25, 25],
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
            };

            try {
                const pdfBlob = await html2pdf().from(element).set(options).toPdf().output('blob');

                const idTokenResult = await user.getIdTokenResult();
                const accessToken = idTokenResult.token;
                
                const form = new FormData();
                form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
                form.append('file', pdfBlob);

                const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                    method: 'POST',
                    headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
                    body: form,
                });

                if (response.ok) {
                    const data = await response.json();
                    const fileId = data.id;
                    console.log('File uploaded to Google Drive. File ID:', fileId);
                    alert('Markdown and PDF uploaded to Google Drive successfully.');
                } else {
                    console.error('Error uploading file to Google Drive:', response.status, response.statusText);
                    console.error('Error details:', await response.text());
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log('User not authenticated with Google.');
        }
    };


    return (
        <div>
            <textarea
                value={markupText}
                onChange={(e) => setMarkupText(e.target.value)}
            />
            <button onClick={exportToPDF}>Export to PDF</button>
            {
                user ? <><button onClick={handleLogOut}>Log Out</button>
                    <button onClick={uploadToGoogleDrive}>
                        Upload to Google Drive
                    </button></>
                    : <button onClick={handelGoogleLogin}>Login with Google</button>
            }
            {
                user &&
                <button onClick={saveToFirebase}>Save to Firebase</button>
            }
        </div>
    );
};

export default Markdown;