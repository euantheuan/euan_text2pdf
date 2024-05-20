import React, { useState } from 'react';
import Header from './Header';
import Buttons from './Buttons';
import TextForm from './TextForm';

const Markdown = () => {
    const [markuptext, setMarkuptext] = useState('');
    const [markuptitle, setMarkuptitle] = useState('');

    return (
        <>
            <Header />
            <main>
                <Buttons markuptext={markuptext} markuptitle={markuptitle} />
                <TextForm setMarkuptext={setMarkuptext} setMarkuptitle={setMarkuptitle} />
            </main>
        </>
    );
};

export default Markdown;