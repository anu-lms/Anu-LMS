import React, { Fragment } from'react';
import { connect } from 'react-redux';
import NotesList from '../../../moleculas/Notebook/NotesList';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import { addNote } from '../../../../actions/notebook';

class NotebookTemplate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeNoteId: -1
    };

    this.addNote = this.addNote.bind(this);
    this.openNote = this.openNote.bind(this);
  }

  componentDidMount() {
    // Set the first note as opened by default.
    if (this.props.notes.length > 0 && this.state.activeNoteId === -1) {
      this.setState({ activeNoteId: this.props.notes[0].id });
    }
  }

  componentDidUpdate() {
    // Set the first note as opened by default.
    if (this.props.notes.length > 0 && this.state.activeNoteId === -1) {
      this.setState({ activeNoteId: this.props.notes[0].id });
    }
  }

  addNote() {

    // Do not add a new note there is already existing one which is not
    // yet saved.
    const index = this.props.notes.findIndex(note => note.id === 0);
    if (index !== -1) {
      return;
    }

    // TODO: Move to reducer.
    const note = {
      id: 0,
      uuid: '',
      created: Math.floor(Date.now() / 1000),
      changed: Math.floor(Date.now() / 1000),
      title: '',
      body: '',
    };

    this.props.dispatch(addNote(note));

    this.setState({ activeNoteId: note.id });
  }

  openNote(id) {
    const index = this.props.notes.findIndex(note => note.id === id);
    const note = this.props.notes[index];
    this.setState({ activeNoteId: note.id });
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
              activeNoteId={this.state.activeNoteId}
              onClick={this.openNote}
            />

          </div>
        </div>

        <div className="note-content d-none d-md-block">
          <div className="container">
            <div className="row">
              <div className="col-12">
                { this.state.activeNoteId !== -1 &&
                <NoteContent activeNoteId={this.state.activeNoteId}/>
                }
              </div>
            </div>
          </div>
        </div>

      </Fragment>
    );
  }
}

const mapStateToProps = ({ notebook }) => ({
  notes: notebook.map(note => note.data).sort((a, b) => {
    if (a.changed < b.changed) {
      return 1;
    }
    if (a.changed > b.changed) {
      return -1;
    }
    return 0;
  }),
});

export default connect(mapStateToProps)(NotebookTemplate);
