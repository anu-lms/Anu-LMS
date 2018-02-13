import React from'react';
import moment from 'moment';
import * as notebookHelpers from '../../../../helpers/notebook';
import NotesListItem from '../../../atoms/Notebook/NotesListItem';

const NotesList = ({ notes, activeNoteId, ...props }) => (
  <div className="notes-list">
    {notes.map(note => (
      <NotesListItem
        key={note.id}
        id={note.id}
        title={note.title ? note.title : notebookHelpers.getFirstTextLine(note.body)}
        teaser={notebookHelpers.getTeaser(note.body)}
        date={moment(note.changed * 1000).format('MM/DD/YY')}
        isActive={note.id === activeNoteId}
        {...props}
      />
    ))}
  </div>
);

export default NotesList;
