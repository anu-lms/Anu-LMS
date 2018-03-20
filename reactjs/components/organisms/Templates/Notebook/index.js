import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router } from "../../../../routes";
import NotesList from '../../../moleculas/Notebook/NotesList';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import AddNoteButton from '../../../moleculas/Notebook/AddNoteButton';
import ShowNotesButton from '../../../moleculas/Notebook/ShowNotesButton';
import * as notebookActions from '../../../../actions/notebook';
import * as notebookHelpers from '../../../../helpers/notebook';

class NotebookTemplate extends React.Component {

  constructor(props) {
    super(props);

    this.showNotes = this.showNotes.bind(this);
    this.openNote = this.openNote.bind(this);
    this.onAfterNoteCreated = this.onAfterNoteCreated.bind(this);
    this.checkUnsavedNotesOnPageClose = this.checkUnsavedNotesOnPageClose.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.checkUnsavedNotesOnPageClose);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.checkUnsavedNotesOnPageClose);
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

  /**
   * Callback gets executed as soon as a note was
   * created on the backend.
   */
  onAfterNoteCreated(note) {
    const { dispatch } = this.props;
    dispatch(notebookActions.setActiveNote(note.id));
    dispatch(notebookActions.toggleMobileVisibility());
  }

  openNote(id) {
    const { dispatch } = this.props;
    dispatch(notebookActions.setActiveNote(id));
    dispatch(notebookActions.toggleMobileVisibility());
  }

  showNotes() {
    const { dispatch } = this.props;
    dispatch(notebookActions.toggleMobileVisibility());
  }

  render() {
    const { notes, activeNote, isMobileContentVisible } = this.props;

    return (
      <Fragment>

        <div className={`notes-list-column ${isMobileContentVisible ? 'hidden' : 'visible'}`}>

          <div className="notes-list-heading">
            <div className="title">My Notebook</div>
            <AddNoteButton onAfterSubmit={this.onAfterNoteCreated} />
          </div>

          <NotesList
            notes={notes}
            activeNoteId={activeNote.id}
            onClick={this.openNote}
          />

        </div>

        <div className={`note-content-wrapper mb-4 ${isMobileContentVisible ? 'visible' : 'hidden'}`}>
          <div className="container">
            <div className="row">
              <div className="col-sm-12 offset-lg-1 col-lg-9">
                {activeNote &&
                <Fragment>

                  <ShowNotesButton
                    handleClick={this.showNotes}
                    label="Back to Notebook"
                  />

                  <NoteContent note={activeNote} />

                </Fragment>
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
