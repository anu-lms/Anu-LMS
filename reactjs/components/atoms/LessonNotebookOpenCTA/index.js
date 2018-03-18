import React from 'react';
import PropTypes from 'prop-types';

const LessonNotebookOpenCTA = ({ handleNotebookOpened }) => (
  <div className="add-note-button" onClick={() => handleNotebookOpened()}>
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="54" height="54" viewBox="0 0 54 54">
      <defs>
        <circle id="b" cx="24" cy="24" r="20"/>
        <filter id="a" width="157.5%" height="157.5%" x="-23.8%" y="-23.8%" filterUnits="objectBoundingBox">
          <feOffset dx="2" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/>
          <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="3.5"/>
          <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path d="M1 1h48v48H1z"/>
        <g transform="translate(1 1)">
          <use fill="#000" filter="url(#a)" xlinkHref="#b"/>
          <use fill="#F5A623" xlinkHref="#b"/>
        </g>
        <g fill="#FFF" fillRule="nonzero">
          <path d="M33.6 14.4H22.8v4.8h-3.6v3.6h-4.8v10.8a2.4 2.4 0 0 0 2.4 2.4h16.8a2.4 2.4 0 0 0 2.4-2.4V16.8a2.4 2.4 0 0 0-2.4-2.4zM20.208 33.6H16.8v-3.408L27.012 19.98l3.408 3.408L20.208 33.6zm13.128-13.128l-1.668 1.656-3.396-3.396 1.656-1.656a.9.9 0 0 1 1.284 0l2.124 2.124a.9.9 0 0 1 0 1.272zM21.6 18H18v3.6h-2.4V18H12v-2.4h3.6V12H18v3.6h3.6V18z"/>
        </g>
      </g>
    </svg>
  </div>
);

LessonNotebookOpenCTA.propTypes = {
  handleNotebookOpened: PropTypes.func.isRequired,
};

export default LessonNotebookOpenCTA;
