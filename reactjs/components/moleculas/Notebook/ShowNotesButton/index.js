import React from 'react';
import PropTypes from 'prop-types';

const ShowNotesButton = ({ handleClick, label }) => (
  <div className="show-note-button" onClick={() => handleClick()} onKeyPress={() => handleClick()}>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <path fillRule="nonzero" d="M16 7H3.83l5.59-5.59L8 0 0 8l8 8 1.41-1.41L3.83 9H16z" />
      </svg>
      <span>{label}</span>
    </div>
  </div>
);

ShowNotesButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

ShowNotesButton.defaultProps = {
  label: 'All Notes',
};

export default ShowNotesButton;
