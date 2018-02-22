import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import * as notebookActions from '../../../../actions/notebook';
import * as notebookHelpers from '../../../../helpers/notebook';
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

    const { dispatch } = this.props;
    this.setState({ isSaving: true });

    // Lock logout until note add operation is safely completed.
    const lock_id = lock.add('notebook-add-note');

    try {
      // Get superagent request with authentication.
      const { request } = await this.context.auth.getRequest();

      const note = await notebookHelpers.createNote(request);
      dispatch(notebookActions.addNote(note));
      dispatch(notebookActions.setActiveNote(note.id));
      dispatch(notebookActions.toggleMobileVisibility());
      this.setState({ isSaving: false });
    }
    catch (error) {
      this.setState({ isSaving: false });
      Alert.error('Could not create a new note. Please, try refreshing the page.');
      console.log(error);
    }

    lock.release(lock_id);
  }

  render() {
    return (
      <div className="add-note">
        <div onClick={this.addNewNote}>
          <svg className="add-note-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="10 0 30 30">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M36.667 0H13.333C11.483 0 10 1.5 10 3.333v23.334A3.332 3.332 0 0 0 13.333 30h23.334C38.5 30 40 28.5 40 26.667V3.333C40 1.5 38.5 0 36.667 0zm-3.334 16.667h-6.666v6.666h-3.334v-6.666h-6.666v-3.334h6.666V6.667h3.334v6.666h6.666v3.334z" />
            </g>
          </svg>
          <span className="caption">Add New</span>
        </div>
      </div>
    );
  }
}

AddNoteButton.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

export default connect()(AddNoteButton);
