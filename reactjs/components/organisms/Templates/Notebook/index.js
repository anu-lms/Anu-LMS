import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotesList from '../../../moleculas/Notebook/NotesList';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import AddNoteButton from '../../../moleculas/Notebook/AddNoteButton';
import * as notebookActions from '../../../../actions/notebook';
import * as notebookHelpers from '../../../../helpers/notebook';
import { Router } from "../../../../routes";
import routerEvents from "../../../../router-events";
import * as lock from "../../../../utils/lock";

class NotebookTemplate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      timerId: 0,
    };

    this.openNote = this.openNote.bind(this);
    this.autoSaveNote = this.autoSaveNote.bind(this);
    this.checkUnsavedNotesOnRouteChange = this.checkUnsavedNotesOnRouteChange.bind(this);
    this.checkUnsavedNotesOnPageClose = this.checkUnsavedNotesOnPageClose.bind(this);
  }

  componentDidMount() {
    this.setState({
      timerId: setInterval(this.autoSaveNote, 5000),
    });

    window.addEventListener('beforeunload', this.checkUnsavedNotesOnPageClose);
    routerEvents.on('routeChangeStart', this.checkUnsavedNotesOnRouteChange);
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
    routerEvents.off('routeChangeStart', this.checkUnsavedNotesOnRouteChange);
    window.removeEventListener('beforeunload', this.checkUnsavedNotesOnRouteChange);
  }

  /**
   * Triggers before page transition and aims to show an alert before user
   * leaves the page if there are some unsaved notes.
   * @see https://github.com/zeit/next.js/issues/2476
   */
  checkUnsavedNotesOnRouteChange() {
    const unsavedNotes = notebookHelpers.getUnsavedNotes(this.props.notes);
    if (unsavedNotes.length > 0) {
      if (!confirm('You have some unsaved changes. Are you sure you want to leave the page?')) {
        setTimeout(() => {
          Router.router.abortComponentLoad();
        });
      }
    }
  }

  /**
   * Triggers before page is closed in browser and aims to show an alert before
   * user leaves the page if there are some unsaved notes.
   */
  checkUnsavedNotesOnPageClose(event) {
    const unsavedNotes = notebookHelpers.getUnsavedNotes(this.props.notes);
    if (unsavedNotes.length > 0) {
      console.log(unsavedNotes);
      let confirmationMessage = 'Changes you made may not be saved.';
      (event || window.event).returnValue = confirmationMessage; // Gecko + IE
      return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
    }
  }

  async autoSaveNote() {
    const { notes, dispatch } = this.props;

    // We're interested only in notes which are not yet saved and not being
    // in the saving process already. Usually it's a quick operation, but you
    // can never count on this.
    const unsavedNotes = notebookHelpers.getUnsavedNotes(notes);

    // If all notes are saved - great, nothing to do here any more.
    if (unsavedNotes.length === 0) {
      return;
    }

    // Get superagent request with authentication.
    const { request } = await this.context.auth.getRequest();

    // Execute all saving operations in parallel.
    // Normally here is just one note to save, but you never know how fast
    // the users these days can be!
    Promise.all(unsavedNotes.map(async note => {

      // Lock logout until update operation for this note is safely completed.
      const lock_id = lock.add('notebook-update-note');

      // Set the note's state to "Is saving".
      dispatch(notebookActions.setNoteStateSaving(note.id));

      try {
        const savedNote = await
          notebookHelpers.updateNote(request, note.title, note.body, note.uuid);

        // Replace the old note with saved one.
        dispatch(notebookActions.addNote(savedNote));

        // Set the note's state to "Saved".
        dispatch(notebookActions.setNoteStateSaved(note.id));
      }
      catch (error) {
        // Set the note's state to "Not Saved".
        dispatch(notebookActions.setNoteStateNotSaved(note.id));
      }

      lock.release(lock_id);
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
  // All notes from the redux store.
  const notes = notebook.notes;

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
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

export default connect(mapStateToProps)(NotebookTemplate);
