import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as notebookHelpers from '../../../../helpers/notebook';
import NotesListItem from '../../../atoms/Notebook/NotesListItem';

const NotesList = ({ notes, activeNoteId, ...props }) => (
  <div className="notes-list">
    {notes.map(note => (
      <NotesListItem
        key={note.id}
        id={note.id}
        title={note.title ? note.title : notebookHelpers.getTeaser(note.body, 1)}
        // eslint-disable-next-line max-len
        teaser={note.title ? notebookHelpers.getTeaser(note.body, 1) : notebookHelpers.getTeaser(note.body, 2)}
        date={moment(note.changed * 1000).format('MM/DD/YY')}
        isActive={note.id === activeNoteId}
        {...props}
      />
    ))}
  </div>
);

NotesList.propTypes = {
  activeNoteId: PropTypes.number,
  notes: PropTypes.arrayOf(PropTypes.object),
};

export default NotesList;
