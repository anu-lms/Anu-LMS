import React, { Fragment } from'react';
import NotesList from '../../../moleculas/NotesList';

const NotebookTemplate = (props) => (
  <Fragment>
    <div className="notes-list-column">
      <NotesList notebook={props.notebook}/>
    </div>
    <div className="note-content-column d-none d-md-block">
      <div className="container">
        <div className="row">
          <div className="col-12">
            Hey, I'm a note content
          </div>
        </div>
      </div>
    </div>

  </Fragment>
);

export default NotebookTemplate;
