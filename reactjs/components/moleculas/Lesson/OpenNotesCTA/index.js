import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddNoteCTA from '../../../atoms/CTA/AddNote';
import * as lessonSidebarActions from '../../../../actions/lessonSidebar';
import * as mediaBreakpoint from '../../../../utils/breakpoints';
import * as navigationActions from '../../../../actions/navigation';
import * as notebookApi from '../../../../api/notebook';
import * as userApi from '../../../../api/user';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';
import * as notebookActions from '../../../../actions/notebook';

class OpenNotesCTA extends React.Component {
  constructor(props) {
    super(props);
    this.openNotebook = this.openNotebook.bind(this);
  }

  /**
   * Performs actions when notebook pane is being opened.
   */
  async openNotebook() {
    const { dispatch, sessionToken } = this.props;

    // As soon as notebook icon is clicked, we change the opening state.
    // It will show a loader instead of note until note is ready to be shown.
    dispatch(lessonSidebarActions.setLoadingState());

    // Let the application now that the notebook is being opened.
    dispatch(lessonSidebarActions.open());

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
      const currentUser = await userApi.fetchCurrent(request);

      const notes = await notebookApi.fetch(request, currentUser.uid);

      // Reset all existing notes in the notebook.
      dispatch(notebookActions.clear());

      // Add all notes from the backend to the notebook storage.
      notes.forEach(note => {
        dispatch(notebookActions.addNote(note));
      });

      request.set('X-CSRF-Token', sessionToken);

      // Make a request to the backend to create a new note.
      const note = await notebookApi.createNote(request);

      // Add recently created note to the notebook's redux state.
      dispatch(notebookActions.addNote(note));

      // Set the active note id for the lesson.
      dispatch(lessonNotebookActions.setActiveNote(note.id));
    } catch (error) {
      console.log('Could not create a new note.', error);
    }

    // Dismiss notebook opening state.
    dispatch(lessonSidebarActions.removeLoadingState());
  }

  render() {
    return (
      <AddNoteCTA onClick={this.openNotebook} />
    );
  }
}

OpenNotesCTA.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

OpenNotesCTA.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

const mapStateToProps = ({ lessonSidebar, user }) => ({
  activeParagraphId: lessonSidebar.comments.paragraphId,
  sessionToken: user.sessionToken,
});

export default connect(mapStateToProps)(OpenNotesCTA);
