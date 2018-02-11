import React, { Fragment } from'react';
import { connect } from 'react-redux';
import NotesList from '../../../moleculas/Notebook/NotesList';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import { addNewNote, setActiveNote } from '../../../../actions/notebook';

class NotebookTemplate extends React.Component {

  constructor(props) {
    super(props);
    this.addNote = this.addNote.bind(this);
    this.openNote = this.openNote.bind(this);
  }

  componentDidMount() {
    // Set the first note as opened by default.
    const { notes, dispatch } = this.props;
    if (notes.length > 0) {
      dispatch(setActiveNote(notes[0].id));
    }
  }

  componentDidUpdate() {
    // Set the first note as opened by default.
    const { notes, activeNote, dispatch } = this.props;
    if (!activeNote && notes.length > 0) {
      dispatch(setActiveNote(notes[0].id));
    }
  }

  addNote() {
    const { dispatch } = this.props;
    dispatch(addNewNote());
  }

  openNote(id) {
    const { dispatch } = this.props;
    dispatch(setActiveNote(id));
  }

  render() {

    return (
      <Fragment>

        <div className="notes-list-column">
          <div className="notes-list-sidebar">

            <div className="notes-list-heading">

              <div className="title">My Notebook</div>

              <div className="add-note" onClick={this.addNote}>
                <svg className="add-note-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="10 0 30 30">
                  <g fill="none" fillRule="evenodd">
                    <path fill="#FFF" fillRule="nonzero" d="M36.667 0H13.333C11.483 0 10 1.5 10 3.333v23.334A3.332 3.332 0 0 0 13.333 30h23.334C38.5 30 40 28.5 40 26.667V3.333C40 1.5 38.5 0 36.667 0zm-3.334 16.667h-6.666v6.666h-3.334v-6.666h-6.666v-3.334h6.666V6.667h3.334v6.666h6.666v3.334z"/>
                  </g>
                </svg>
                <span className="caption">Add New</span>
              </div>

            </div>

            <NotesList
              notes={this.props.notes}
              activeNoteId={this.props.activeNote.id}
              onClick={this.openNote}
            />

          </div>
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
