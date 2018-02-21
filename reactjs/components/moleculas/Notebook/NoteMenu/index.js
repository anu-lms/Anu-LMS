import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import Dropdown, { ImportantMenuItem, MenuIcon, DeleteIcon } from '../../../atoms/DropdownMenu';
import * as notebookActions from "../../../../actions/notebook";
import * as lock from '../../../../utils/lock';

class NoteMenu extends Component {

  async onDelete() {
    const { note, dispatch } = this.props;

    if (window.confirm('Delete this note?')) {
      // Lock logout until delete operation is safely completed.
      const lock_id = lock.add('logout');

      // Hide the note immediately after confirmation.
      dispatch(notebookActions.deleteNote(note.id));

      // Make DELETE request.
      try {
        // Get superagent request with authentication.
        const { request } = await this.context.auth.getRequest();

        await request
          .delete('/jsonapi/notebook/notebook/' + note.uuid)
          .send();
        // Go back to the list of notes on mobile.
        dispatch(notebookActions.toggleMobileVisibility());
      }
      catch (error) {
        console.log(error);
        Alert.error('Could not delete the note. Please reload the page and try again.');
      }

      lock.release('logout', lock_id);
    }
  }

  render() {
    return (
      <Dropdown>
        <Dropdown.Toggle
          noCaret
          btnStyle="link"
        >
          <MenuIcon />
        </Dropdown.Toggle>
        <Dropdown.MenuWrapper pullRight>
          <Dropdown.Menu pullRight>
            <ImportantMenuItem onSelect={() => { this.onDelete() }} >
              <DeleteIcon /> Delete Note
            </ImportantMenuItem>
          </Dropdown.Menu>
        </Dropdown.MenuWrapper>
      </Dropdown>
    )
  }
}

NoteMenu.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

export default connect()(NoteMenu);