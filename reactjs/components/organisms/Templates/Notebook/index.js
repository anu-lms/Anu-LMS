import React, { Fragment } from'react';
import NotesList from '../../../moleculas/NotesList';
import Button from '../../../atoms/Button';
import Editor from '../../../atoms/RichEditor';

const NotebookTemplate = (props) => (
  <Fragment>

    <div className="notes-list-column">
      <NotesList notebook={props.notebook}/>
    </div>

    <div className="note-content d-none d-md-block">
      <div className="container">
        <div className="row">
          <div className="col-12">

            <div className="caption sm">
              Updated February 6, 2018 at 5:26pm
            </div>

            <h4 className="title editable">
              Outline of an article on Paul Rand’s Thoughts on Design
            </h4>

            <Editor />

            <div className="mb-5" />

            <Button block className="mt-3">Save</Button>

          </div>
        </div>
      </div>
    </div>

  </Fragment>
);

export default NotebookTemplate;
