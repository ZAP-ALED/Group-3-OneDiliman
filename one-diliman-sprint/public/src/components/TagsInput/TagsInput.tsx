import React, { useEffect, useState } from 'react';
import './TagsInput.css';

const TagsInput = ({ tags, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [localTags, setLocalTags] = useState(tags || []);

    useEffect(() => {
        setLocalTags(tags || []);
    }, [tags]);

    const removeTags = indexToRemove => {
        setLocalTags(localTags.filter((_, index) => index !== indexToRemove));
    };

    const addTags = event => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            setLocalTags([...localTags, inputValue.trim()]);
            setInputValue('');
        }
    };

    useEffect(() => {
        onChange(localTags);
    }, [localTags, onChange]);

    return (
        <div className="tags-input tags-input-style">
            <ul id="tags">
                {localTags.map((tag, index) => (
                    <li key={index} className="tag tags-input-style">
                        <span className='tag-title tags-input-style'>{tag}</span>
                        <span className='tag-close-icon tags-input-style' onClick={() => removeTags(index)}>x</span>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyUp={addTags}
                placeholder="Press enter to add tags"
            />
        </div>
    );
};

export default TagsInput;
