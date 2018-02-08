import React, { Fragment } from'react';
import NoteItem from '../../../atoms/Notebook/NoteItem';

const NotebookTemplate = (props) => (
  <Fragment>
    <div className="notes-list">

      <div className="heading">
        <div className="title">My Notebook</div>
        <div className="add-note">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="10 0 30 30">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M36.667 0H13.333C11.483 0 10 1.5 10 3.333v23.334A3.332 3.332 0 0 0 13.333 30h23.334C38.5 30 40 28.5 40 26.667V3.333C40 1.5 38.5 0 36.667 0zm-3.334 16.667h-6.666v6.666h-3.334v-6.666h-6.666v-3.334h6.666V6.667h3.334v6.666h6.666v3.334z"/>
            </g>
          </svg>
          <span className="caption">Add New</span>
        </div>
      </div>

      <NoteItem
        title={"Outline of an article on Paul R…"}
        teaser={"Paul Rand is best remembered today for his …"}
        date={"02/06/18"}
      />
      <NoteItem
        title={"Outline of an article on Paul R…"}
        teaser={"Paul Rand is best remembered today for his …"}
        date={"02/06/18"}
      />
    </div>


    <div className="note-content d-none d-md-block">
      Hey, I'm a note content
    </div>

  </Fragment>
);

export default NotebookTemplate;
