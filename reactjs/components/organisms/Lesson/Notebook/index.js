import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import NotesList from '../../../moleculas/Notebook/NotesList';
import LessonNotebookOpenCTA from '../../../atoms/LessonNotebookOpenCTA';
import PageLoader from '../../../atoms/PageLoader';
import * as mediaBreakpoint from '../../../../utils/breakpoints';
import ShowNotesButton from '../../../moleculas/Notebook/ShowNotesButton';
import AddNoteButton from '../../../moleculas/Notebook/AddNoteButton';
import * as notebookActions from '../../../../actions/notebook';
import * as navigationActions from '../../../../actions/navigation';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';
import * as notebookHelpers from '../../../../helpers/notebook';
import * as dataProcessors from '../../../../utils/dataProcessors';

class LessonNotebook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Indicates if the notebook pane is being opened.
      isNotebookOpening: false,
    };

    this.showNotes = this.showNotes.bind(this);
    this.openNote = this.openNote.bind(this);
    this.onBeforeNoteCreated = this.onBeforeNoteCreated.bind(this);
    this.onAfterNoteCreated = this.onAfterNoteCreated.bind(this);
    this.handleNotebookOpen = this.handleNotebookOpen.bind(this);
    this.handleNotebookClose = this.handleNotebookClose.bind(this);
  }

  /**
   * Callback gets executed as soon as a user click
   * on note create button.
   */
  onBeforeNoteCreated() {
    // Set loading background.
    this.setState({ isNotebookOpening: true });
  }

  /**
   * Callback gets executed as soon as a note was
   * created on the backend.
   */
  onAfterNoteCreated(note) {
    // Remove loading background and open a note.
    this.setState({ isNotebookOpening: false });
    this.openNote(note.id);
  }

  showNotes() {
    const { dispatch } = this.props;
    dispatch(lessonNotebookActions.showNotes());
  }

  openNote(id) {
    const { dispatch } = this.props;
    dispatch(lessonNotebookActions.setActiveNote(id));
  }

  /**
   * Performs actions when notebook pane is being opened.
   */
  async handleNotebookOpen() {
    const { dispatch } = this.props;

    // As soon as notebook icon is clicked, we change the opening state.
    // It will show a loader instead of note until note is ready to be shown.
    this.setState({ isNotebookOpening: true });

    // Let the application now that the notebook is being opened.
    dispatch(lessonNotebookActions.open());

    // If notebook is opened, close navigation pane on all devices except extra
    // large.
    if (mediaBreakpoint.isDown('xxl')) {
      dispatch(navigationActions.close());
    }

    try {
      // Get superagent request with authentication token.
      const { request } = await this.context.auth.getRequest();

      // Get currently logged in user.
      // @todo: consider to store user id in local storage after user login.
      const userResponse = await request.get('/user/me?_format=json');
      const currentUser = dataProcessors.userData(userResponse.body);

      const responseNotebook = await request
        .get('/jsonapi/notebook/notebook')
        .query({
          // Filter notes by current user.
          'filter[uid][value]': currentUser.uid,
          // Sort by changed date. Here we sort in the reverse
          // order from what we need, because in the reducer all new notes
          // get added to the start of the queue, which will make the final
          // order of the notes on the page correct.
          'sort': 'changed',
        });

      const notes = dataProcessors.notebookData(responseNotebook.body.data);

      // Reset all existing notes in the notebook.
      dispatch(notebookActions.clear());

      // Add all notes from the backend to the notebook storage.
      notes.forEach((note) => {
        dispatch(notebookActions.addNote(note));
      });

      // Make a request to the backend to create a new note.
      const note = await notebookHelpers.createNote(request);

      // Add recently created note to the notebook's redux state.
      dispatch(notebookActions.addNote(note));

      // Set the active note id for the lesson.
      dispatch(lessonNotebookActions.setActiveNote(note.id));
    } catch (error) {
      console.log('Could not create a new note. Error:');
      console.log(error);
    }

    // Dismiss notebook opening state.
    this.setState({ isNotebookOpening: false });
  }

  /**
   * Perform actions on closing the notebook pane.
   */
  handleNotebookClose() {
    const { dispatch, activeNote } = this.props;
    // Force save note to the backend.
    if (activeNote) {
      dispatch(notebookActions.saveNote(activeNote));
    }

    // Close the notebook pane.
    dispatch(lessonNotebookActions.close());
  }

  render() {
    const {
      isCollapsed, isNoteListVisible, notes, activeNote,
    } = this.props;

    return (
      <div className={`collapsible-notebook lesson  ${isCollapsed ? 'closed' : 'opened'}`}>

        {isCollapsed &&
        <LessonNotebookOpenCTA handleNotebookOpen={this.handleNotebookOpen} />
        }

        <div className="lesson-notebook-wrapper">
          {!isCollapsed &&
          <div className="lesson-notebook">

            {this.state.isNotebookOpening &&
            <PageLoader />
            }

            {!this.state.isNotebookOpening &&
            <Fragment>

              <div className={`notes-list-column ${isNoteListVisible ? 'visible' : 'hidden'}`}>

                <div className="notes-list-heading">
                  <div className="title">All Notes</div>
                  <AddNoteButton
                    onBeforeSubmit={this.onBeforeNoteCreated}
                    onAfterSubmit={this.onAfterNoteCreated}
                  />
                </div>

                <NotesList
                  notes={notes}
                  activeNoteId={activeNote ? activeNote.id : 0}
                  onClick={this.openNote}
                />
              </div>

              {!isNoteListVisible && activeNote &&
              <Fragment>
                <ShowNotesButton handleClick={this.showNotes} />
                <NoteContent note={activeNote} />
              </Fragment>
              }

              <div className="save-close" onClick={() => this.handleNotebookClose()} onKeyPress={() => this.handleNotebookClose()}>
                { isNoteListVisible ? 'Close Notes' : 'Save and Close' }

                <span className="close-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="#FFF" fillRule="nonzero" d="M0 9h12.17l-5.59 5.59L8 16l8-8-8-8-1.41 1.41L12.17 7H0z" />
                  </svg>
                </span>
              </div>

            </Fragment>
            }
          </div>

          }
        </div>

      </div>
    );
  }
}

LessonNotebook.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeNote: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isCollapsed: PropTypes.bool.isRequired,
  isNoteListVisible: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

LessonNotebook.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

const mapStateToProps = ({ lessonNotebook, notebook }) => ({
  isCollapsed: lessonNotebook.isCollapsed,
  activeNote: notebookHelpers.getNoteById(notebook.notes, lessonNotebook.noteId),
  notes: notebook.notes,
  isNoteListVisible: lessonNotebook.isNoteListVisible,
});

export default connect(mapStateToProps)(LessonNotebook);
