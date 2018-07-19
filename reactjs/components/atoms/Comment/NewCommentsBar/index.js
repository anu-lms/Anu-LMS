import React from 'react';

const NewCommentsBar = ({ newCommentsAmount }) => (
  <button className="new-comments-bar">
    <span className="arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
        <g fill="none" fillRule="evenodd">
          <path fill="#FFF" fillRule="nonzero" d="M11.333 6l-.94-.94-3.726 3.72V.667H5.333V8.78l-3.72-3.727L.667 6 6 11.333z" />
        </g>
      </svg>
    </span>

    {newCommentsAmount} new comments

    <button className="close-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
        <g fill="none" fillRule="evenodd">
          <path fill="#FFF" fillRule="nonzero" d="M9.667 1.273l-.94-.94L5 4.06 1.273.333l-.94.94L4.06 5 .333 8.727l.94.94L5 5.94l3.727 3.727.94-.94L5.94 5z" />
        </g>
      </svg>
    </button>
  </button>
);

export default NewCommentsBar;
