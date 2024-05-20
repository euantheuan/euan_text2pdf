import React, { useEffect } from 'react';

const TextForm = ({ setMarkuptext, setMarkuptitle, setEditMode }) => {
    useEffect(() => {
        setEditMode(false);
    }, [setEditMode]);
    return (
        <div className="text_area">
            <input
                type="text"
                placeholder="이곳에 제목을 입력하세요."
                className="text_title"
                onChange={(e) => setMarkuptitle(e.target.value)}
            />
            <textarea
                onChange={(e) => setMarkuptext(e.target.value)}
                placeholder="이곳에 마크다운 문법을 이용해 본문을 입력하세요."
                className="text_desc"
            />
        </div>
    );
};

export default TextForm;