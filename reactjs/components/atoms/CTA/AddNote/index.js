import React from 'react';
import PropTypes from 'prop-types';

const AddNote = ({ onClick }) => (
  <div className="add-note-button" onClick={onClick} onKeyPress={onClick}>
    <svg width="64px" height="64px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <defs>
        <circle id="path-1" cx="32" cy="32" r="26.6666667" />
        <filter x="-13.1%" y="-13.1%" width="130.0%" height="130.0%" filterUnits="objectBoundingBox" id="filter-2">
          <feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur stdDeviation="2.5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
          <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1" />
        </filter>
      </defs>
      <g id="Mock-Notes-from-Lessons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Group-8" transform="translate(-2.000000, -1.000000)">
          <g id="Placeholder-Add-note">
            <rect id="Rectangle-2" x="0" y="0" width="64" height="64" />
            <g id="Oval">
              <use fill="black" fillOpacity="1" filter="url(#filter-2)" xlinkHref="#path-1" />
              <use fill="#F5A623" fillRule="evenodd" xlinkHref="#path-1" />
            </g>
          </g>
          <g id="add-note-02fix" transform="translate(12.000000, 12.000000)">
            <polygon id="Shape" points="0 0 40 0 40 40 0 40" />
            <path d="M31.6666667,5 L16.6666667,5 L16.6666667,11.6666667 L11.6666667,11.6666667 L11.6666667,16.6666667 L5,16.6666667 L5,31.6666667 C5,33.5076158 6.49238417,35 8.33333333,35 L31.6666667,35 C33.5076158,35 35,33.5076158 35,31.6666667 L35,8.33333333 C35,6.49238417 33.5076158,5 31.6666667,5 Z M13.0666667,31.6666667 L8.33333333,31.6666667 L8.33333333,26.9333333 L22.5166667,12.75 L27.25,17.4833333 L13.0666667,31.6666667 Z M31.3,13.4333333 L28.9833333,15.7333333 L24.2666667,11.0166667 L26.5666667,8.71666667 C26.8016908,8.47744784 27.1229798,8.34269781 27.4583333,8.34269781 C27.7936868,8.34269781 28.1149759,8.47744784 28.35,8.71666667 L31.3,11.6666667 C31.7874223,12.1546959 31.7874223,12.9453041 31.3,13.4333333 Z M15,10 L10,10 L10,15 L6.66666667,15 L6.66666667,10 L1.66666667,10 L1.66666667,6.66666667 L6.66666667,6.66666667 L6.66666667,1.66666667 L10,1.66666667 L10,6.66666667 L15,6.66666667 L15,10 Z" id="Shape" fill="#FFFFFF" fillRule="nonzero" />
          </g>
        </g>
      </g>
    </svg>
  </div>
);

AddNote.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddNote;
