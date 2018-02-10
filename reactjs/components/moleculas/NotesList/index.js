import React, { Fragment } from'react';
import moment from 'moment';
import * as notebookHelpers from "../../../helpers/notebook";
import NotesListItem from '../../atoms/Notebook/NotesListItem';

const NotesList = (props) => (
  <div className="notes-list-sidebar">

    <div className="notes-list-heading">
      <div className="title">My Notebook</div>
      <div className="add-note">
        <svg className="add-note-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="10 0 30 30">
          <g fill="none" fillRule="evenodd">
            <path fill="#FFF" fillRule="nonzero" d="M36.667 0H13.333C11.483 0 10 1.5 10 3.333v23.334A3.332 3.332 0 0 0 13.333 30h23.334C38.5 30 40 28.5 40 26.667V3.333C40 1.5 38.5 0 36.667 0zm-3.334 16.667h-6.666v6.666h-3.334v-6.666h-6.666v-3.334h6.666V6.667h3.334v6.666h6.666v3.334z"/>
          </g>
        </svg>
        <span className="caption">Add New</span>
      </div>
    </div>

    <div className="notes-list">
      {props.notebook.map(notebook => (
        <NotesListItem
          key={notebook.id}
          title={notebook.title ? notebook.title : notebookHelpers.getTeaser(notebook.body)}
          teaser={notebookHelpers.getTeaser(notebook.body)}
          date={moment(notebook.changed * 1000).format('MM/DD/YYYY')}
        />
      ))}
    </div>
  </div>
);

export default NotesList;
