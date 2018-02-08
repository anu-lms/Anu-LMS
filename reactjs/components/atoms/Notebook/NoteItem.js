import React from 'react';
import PropTypes from 'prop-types';

const NoteItem = ({ title, date, teaser }) => (
  <div className="note-item">
    <div className="title">{title}</div>
    <div className="date">{date}</div>
    <div className="teaser">{teaser}</div>
  </div>
);

NoteItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  teaser: PropTypes.string.isRequired,
};

export default NoteItem;
