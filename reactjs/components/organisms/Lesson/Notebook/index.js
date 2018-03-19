import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect} from 'react-redux';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import LessonNotebookOpenCTA from '../../../atoms/LessonNotebookOpenCTA';
import PageLoader from '../../../atoms/PageLoader';
import * as notebookActions from '../../../../actions/notebook';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';
import * as notebookHelpers from '../../../../helpers/notebook';

class LessonNotebook extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // Indicates if the notebook pane is being opened.
      isNotebookOpening: false,
    };

    this.handleNotebookOpened = this.handleNotebookOpened.bind(this);
    this.handleNotebookClosed = this.handleNotebookClosed.bind(this);
  }

  async handleNotebookOpened() {
    const { dispatch } = this.props;

    // As soon as notebook icon is clicked, we change the opening state.
    // It will show a loader instead of note until note is ready to be shown.
    this.setState({ isNotebookOpening: true });

    // Let the application now that the notebook is being opened.
    dispatch(lessonNotebookActions.notebookOpened());

    try {

      // Get superagent request with authentication token.
      const { request } = await this.context.auth.getRequest();

      // Make a request to the backend to create a new note.
      const note = await notebookHelpers.createNote(request);

      // Add recently created note to the notebook's redux state.
      dispatch(notebookActions.addNote(note));

      // Set the active note id for the lesson.
      dispatch(lessonNotebookActions.setActiveNote(note.id));
    } catch(error) {
      console.log('Could not create a new note. Error:');
      console.log(error);
    }

    // Dismiss notebook opening state.
    this.setState({ isNotebookOpening: false });
  }

  handleNotebookClosed() {
    this.props.dispatch(lessonNotebookActions.notebookClosed());
  }

  render() {
    const { isCollapsed, note } = this.props;

    return (
      <div className={`collapsible-notebook lesson  ${isCollapsed ? 'closed' : 'opened'}`}>

        {isCollapsed &&
        <LessonNotebookOpenCTA handleNotebookOpened={this.handleNotebookOpened}/>
        }

        {!isCollapsed &&
        <div className="lesson-notebook">

          {this.state.isNotebookOpening &&
          <PageLoader/>
          }

          {!this.state.isNotebookOpening &&
          <Fragment>

            <NoteContent note={note}/>

            <div className="save-close" onClick={() => this.handleNotebookClosed()}>
              Save and Close
            </div>

          </Fragment>
          }

        </div>
        }

      </div>
    )
  }

}

LessonNotebook.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

const mapStateToProps = ({ lessonNotebook, notebook }) => ({
  isCollapsed: lessonNotebook.isCollapsed,
  note: notebookHelpers.getNoteById(notebook.notes, lessonNotebook.noteId),
});

export default connect(mapStateToProps)(LessonNotebook);
