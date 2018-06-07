import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const NotesListItem = ({ id, title, date, teaser, isActive, onClick }) => (
  <div id={`note-${id}`} className={`notes-list-item ${isActive ? 'active' : ''}`} onClick={() => onClick(id)} onKeyPress={() => onClick(id)}>
    <div className="item-heading">
      <div className="title">{title}{!title && 'New Note'}</div>
      <div className="date">{date}</div>
    </div>
    <div className="teaser">
      {teaser}
      {!teaser &&
      <Fragment>&nbsp;</Fragment>
      }
    </div>
  </div>
);

NotesListItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  teaser: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

NotesListItem.defaultProps = {
  onClick: () => {},
  isActive: false,
};

export default NotesListItem;
