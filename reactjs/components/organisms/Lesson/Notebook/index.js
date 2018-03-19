import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect} from 'react-redux';
import NoteContent from '../../../moleculas/Notebook/NoteContent';
import LessonNotebookOpenCTA from '../../../atoms/LessonNotebookOpenCTA';
import PageLoader from '../../../atoms/PageLoader';
import * as notebookActions from '../../../../actions/notebook';
import * as navigationActions from '../../../../actions/navigation';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';
import * as notebookHelpers from '../../../../helpers/notebook';

class LessonNotebook extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // Indicates if the notebook pane is being opened.
      isNotebookOpening: false,
    };

    this.handleNotebookOpen = this.handleNotebookOpen.bind(this);
    this.handleNotebookClose = this.handleNotebookClose.bind(this);
  }

  async handleNotebookOpen() {
    const { dispatch } = this.props;

    // As soon as notebook icon is clicked, we change the opening state.
    // It will show a loader instead of note until note is ready to be shown.
    this.setState({ isNotebookOpening: true });

    // Let the application now that the notebook is being opened.
    dispatch(lessonNotebookActions.open());

    // If notebook opened, close navigation pane on all devices except extra
    // large.
    if (window.innerWidth < 1840) {
      dispatch(navigationActions.close());
    }

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

  handleNotebookClose() {
    this.props.dispatch(lessonNotebookActions.close());
  }

  render() {
    const { isCollapsed, note } = this.props;

    return (
      <div className={`collapsible-notebook lesson  ${isCollapsed ? 'closed' : 'opened'}`}>

        {isCollapsed &&
        <LessonNotebookOpenCTA handleNotebookOpen={this.handleNotebookOpen}/>
        }

        <div className="lesson-notebook-wrapper">
          {!isCollapsed &&
          <div className="lesson-notebook">

          {this.state.isNotebookOpening &&
          <PageLoader/>
          }

          {!this.state.isNotebookOpening && note &&
          <Fragment>

            <NoteContent note={note}/>

            <div className="save-close" onClick={() => this.handleNotebookClose()}>
              Save and Close
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
