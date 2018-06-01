import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import * as notebookActions from '../../../../actions/notebook';
import * as notebookApi from '../../../../api/notebook';
import * as lock from '../../../../utils/lock';

class AddNoteButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
    };

    this.addNewNote = this.addNewNote.bind(this);
  }

  async addNewNote() {
    // Don't allow to send requests twice before the previous one is completed.
    if (this.state.isSaving) {
      return;
    }

    const { dispatch, onBeforeSubmit, onAfterSubmit, sessionToken } = this.props;

    // Execute callback before adding a new note.
    if (onBeforeSubmit) {
      onBeforeSubmit();
    }

    // Change the component's state to saving.
    this.setState({ isSaving: true });

    // Lock logout until note add operation is safely completed.
    const lockId = lock.add('notebook-add-note');

    try {
      // Get superagent request with authentication.
      const { request } = await this.context.auth.getRequest();

      request.set('X-CSRF-Token', sessionToken);

      // Saving a note and adding to the notebook.
      const note = await notebookApi.createNote(request);
      dispatch(notebookActions.addNoteToStore(note));

      // Execute callback when note was added.
      if (onAfterSubmit) {
        onAfterSubmit(note);
      }

      this.setState({ isSaving: false });
    }
    catch (error) {
      this.setState({ isSaving: false });
      Alert.error('Could not create a new note. Please, try refreshing the page.', error);
    }

    lock.release(lockId);
  }

  render() {
    return (
      <div className="add-note">
        <div onClick={this.addNewNote} onKeyPress={this.addNewNote}>
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M30.667 4h-15v6.667h-5v5H4v15A3.333 3.333 0 0 0 7.333 34h23.334A3.333 3.333 0 0 0 34 30.667V7.333A3.333 3.333 0 0 0 30.667 4zm-18.6 26.667H7.333v-4.734L21.517 11.75l4.733 4.733-14.183 14.184zM30.3 12.433l-2.317 2.3-4.716-4.716 2.3-2.3a1.25 1.25 0 0 1 1.783 0l2.95 2.95a1.25 1.25 0 0 1 0 1.766zM14 9H9v5H5.667V9h-5V5.667h5v-5H9v5h5V9z" />
            </g>
          </svg>
          <span className="caption">Add New</span>
        </div>
      </div>
    );
  }
}

AddNoteButton.propTypes = {
  onBeforeSubmit: PropTypes.func,
  onAfterSubmit: PropTypes.func,
};

AddNoteButton.defaultProps = {
  onBeforeSubmit: () => {},
  onAfterSubmit: () => {},
};

AddNoteButton.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

const mapStateToProps = ({ user }) => ({
  sessionToken: user.sessionToken,
});

export default connect(mapStateToProps)(AddNoteButton);
