import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotesList from '../../../moleculas/Notebook/NotesList';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import AddNoteButton from '../../../moleculas/Notebook/AddNoteButton';
import * as notebookActions from '../../../../actions/notebook';
import * as notebookHelpers from "../../../../helpers/notebook";



class NotebookTemplate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      timerId: 0,
    };

    this.openNote = this.openNote.bind(this);
    this.autoSaveNote = this.autoSaveNote.bind(this);
  }

  componentDidMount() {
    this.setState({
      timerId: setInterval(this.autoSaveNote, 5000),
    });

    /*window.addEventListener("beforeunload", function (e) {
      let confirmationMessage = 'Changes you made may not be saved.';
      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });*/
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  async autoSaveNote() {
    const { notes, dispatch } = this.props;

    // We're interested only in notes which are not yet saved and not being
    // in the saving process already. Usually it's a quick operation, but you
    // can never count on this.
    const unsavedNotes = notes.filter(note => {
      const isSaved = typeof note.isSaved !== 'undefined' && note.isSaved === true;
      const isSaving = typeof note.isSaving !== 'undefined' && note.isSaving === true;
      return !isSaved && !isSaving;
    });

    // If all notes are saved - great, nothing to do here any more.
    if (unsavedNotes.length === 0) {
      return;
    }

    // TODO: Authentication may drop if expired.
    const request = this.context.request();

    // TODO: Remove.
    console.log('Notes to save:');
    console.log(unsavedNotes);

    // Execute all saving operations in parallel.
    // Normally here is just one note to save, but you never know how fast
    // the users these days can be!
    Promise.all(unsavedNotes.map(async note => {

      // Set the note's state to "Is saving".
      dispatch(notebookActions.setNoteStateSaving(note.id));

      try {
        const savedNote = await
          notebookHelpers.updateNote(request, note.title, note.body, note.uuid);

        // Replace the old note with saved one.
        dispatch(notebookActions.addNote(savedNote));

        // Set the note's state to "Saved".
        dispatch(notebookActions.setNoteStateSaved(note.id));

        // TODO: Remove.
        console.log('Saved note:');
        console.log(note);
      }
      catch (error) {
        // Set the note's state to "Not Saved".
        dispatch(notebookActions.setNoteStateNotSaved(note.id));
      }
    }));
  }

  openNote(id) {
    const { dispatch } = this.props;
    dispatch(notebookActions.setActiveNote(id));
    dispatch(notebookActions.toggleMobileVisibility());
  }

  render() {
    const { notes, activeNote, isMobileContentVisible } = this.props;

    return (
      <Fragment>

        <div className={`notes-list-column ${isMobileContentVisible ? 'hidden' : 'visible'}`}>

          <div className="notes-list-heading">
            <div className="title">My Notebook</div>
            <AddNoteButton />
          </div>

          <NotesList
            notes={notes}
            activeNoteId={activeNote.id}
            onClick={this.openNote}
          />

        </div>

        <div className={`note-content mb-4 ${isMobileContentVisible ? 'visible' : 'hidden'}`}>
          <div className="container">
            <div className="row">
              <div className="col-sm-12 offset-lg-1 col-lg-9">
                {activeNote &&
                  <NoteContent note={activeNote} />
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
    isMobileContentVisible: notebook.isMobileContentVisible,
  }
};

NotebookTemplate.contextTypes = {
  request: PropTypes.func,
};

export default connect(mapStateToProps)(NotebookTemplate);
