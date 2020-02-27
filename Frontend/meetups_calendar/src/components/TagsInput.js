import React from 'react';

export function TagsInput({ tags, onTagsChanged }) {
  return (
    <div className="tags-container">
      <ul>
        {tags.map(tag => (
          <li key={tag}>
            {tag}
            <button onClick={() => onTagsChanged(tags.filter(t => tag !== t))}>
              x
            </button>
          </li>
        ))}

        <div className="tags-input-container">
          <input
            type="text"
            placeholder="Enter tag"
            onKeyPress={e => {
              if (e.key === 'Enter' && !tags.includes(e.target.value)) {
                onTagsChanged([...tags, e.target.value]);
                e.target.value = '';
              }
            }}
          />
        </div>
      </ul>
    </div>
  );
}
