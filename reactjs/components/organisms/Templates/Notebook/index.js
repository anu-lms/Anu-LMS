import React, { Fragment } from'react';
import { connect } from 'react-redux';
import NotesList from '../../../moleculas/Notebook/NotesList';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import AddNoteButton from '../../../moleculas/Notebook/AddNoteButton';
import { setActiveNote } from '../../../../actions/notebook';

class NotebookTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.openNote = this.openNote.bind(this);
  }

  openNote(id) {
    const { dispatch } = this.props;
    dispatch(setActiveNote(id));
  }

  render() {

    return (
      <Fragment>

        <div className="notes-list-column">

          <div className="notes-list-heading">
            <div className="title">My Notebook</div>
            <AddNoteButton />
          </div>

          <NotesList
            notes={this.props.notes}
            activeNoteId={this.props.activeNote.id}
            onClick={this.openNote}
          />

        </div>

        <div className="note-content d-none d-md-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {this.props.activeNote &&
                <NoteContent note={this.props.activeNote}/>
                }
              </div>
            </div>
          </div>
        </div>

      </Fragment>
    );
  }
}

const mapStateToProps = ({ notebook }) => {
  // Automatically sort all notes by changed date.
  const notes = notebook.notes.sort((a, b) => {
    if (a.changed < b.changed) {
      return 1;
    }
    if (a.changed > b.changed) {
      return -1;
    }
    return 0;
  });

  // Search for active note in the list of notes.
  const index = notebook.notes.findIndex(note => note.id === notebook.activeNoteId);
  const activeNote = index !== -1 ? notebook.notes[index] : {};

  return {
    notes,
    activeNote,
  }
};

export default connect(mapStateToProps)(NotebookTemplate);
