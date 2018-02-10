import React from 'react';
import PropTypes from 'prop-types';

const NotesListItem = ({ title, date, teaser }) => (
  <div className="notes-list-item">
    <div className="item-heading">
      <div className="title">{title}</div>
      <div className="date">{date}</div>
    </div>
    <div className="teaser">{teaser}</div>
  </div>
);

NotesListItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  teaser: PropTypes.string.isRequired,
};

export default NotesListItem;
