import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import urlParse from 'url-parse';
import Alert from 'react-s-alert';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import NotebookTemplate from '../components/organisms/Templates/Notebook';
import SiteTemplate from '../components/organisms/Templates/SiteTemplate';
import * as notebookActions from '../actions/notebook';
import * as userApi from '../api/user';
import * as notebookApi from '../api/notebook';

class NotebookPage extends Component {
  static async getInitialProps({ request, res }) {
    let initialProps = {
      notes: [],
      statusCode: 200,
    };

    try {
      // Get currently logged in user.
      const currentUser = await userApi
        .fetchCurrent(request)
        .catch(error => {
          initialProps.statusCode = error.response.status;
          throw Error(error.response.body.message);
        });

      initialProps.notes = await notebookApi.fetchNotes(request, currentUser.uid);
    } catch (error) {
      console.error('Could not fetch notebook notes.', error);
      initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;
      if (res) res.statusCode = initialProps.statusCode;
      return initialProps;
    }

    // If no notes available on the backend - add a welcome note by default.
    if (initialProps.notes.length === 0) {
      try {
        const title = 'Taking Notes';
        const body = '<p><strong>Welcome to your personal notebook!</strong> This is your space to record and reflect.</p><p></p><p>Format text using the options above for <strong>bold</strong>, <em>italics</em>, and <u>underline.</u></p><ul><li>Create lists with bullet points or numbers!</li></ul><p><u>Notes are saved automatically</u>, so don’t worry about losing anything by accident.</p><p></p><p>If you decide to delete a note, simply select “Delete Note” from the menu options at the top right corner of this page (the 3 dots icon).</p><p></p><p><strong>Take a new note with the “Add New” icon at the top of your notebook!</strong></p>';

        const sessionToken = await request.get('/session/token');
        request.set('X-CSRF-Token', sessionToken.text);

        const note = await notebookApi.createNote(request, title, body);
        initialProps.notes = [note];
      } catch (error) {
        console.log('Could not create a welcome note.', error);
      }
    }

    return initialProps;
  }

  componentDidMount() {
    this.initializeNotebook();
  }

  componentDidUpdate() {
    this.initializeNotebook();
  }

  initializeNotebook() {
    const { isStoreRehydrated, notes, dispatch } = this.props;
    if (isStoreRehydrated) {
      let activeNoteId = null;
      const parsedUrl = urlParse(window.location.href, true);

      // Page can receive active note id as `note` param in URL.
      if (parsedUrl.query && parsedUrl.query.note) {
        const index = notes.findIndex(note => note.id === parseInt(parsedUrl.query.note, 10));

        if (index === -1) {
          Alert.error("Referenced in url note doesn't exists");
          console.error("Referenced note doesn't exists", `Note: ${parsedUrl.query.note}`);
        }
        else {
          activeNoteId = parseInt(parsedUrl.query.note, 10);
        }
      }

      // Reset all existing notes in the notebook.
      dispatch(notebookActions.clear());

      // Add all notes from the backend to the notebook storage.
      notes.forEach(note => {
        dispatch(notebookActions.addNoteToStore(note));
      });

      // Set first note as active if there is no `note` param in url.
      if (!activeNoteId) {
        activeNoteId = notes[notes.length - 1].id;
      }

      // Automatically set the last note (first in the displayed list) as
      // active for editing.
      if (notes.length > 0) {
        dispatch(notebookActions.setActiveNote(activeNoteId));
        dispatch(notebookActions.toggleMobileVisibility());
      }
    }
  }

  render() {
    const { statusCode } = this.props;
    return (
      <SiteTemplate statusCode={statusCode} className="page-notebook">
        <NotebookTemplate />
      </SiteTemplate>
    );
  }
}

NotebookPage.propTypes = {
  isStoreRehydrated: PropTypes.bool.isRequired,
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  statusCode: PropTypes.number,
};

NotebookPage.defaultProps = {
  statusCode: 200,
};

const mapStateToProps = store => {
  let state = {
    isStoreRehydrated: false,
  };

  if (typeof store._persist !== 'undefined') { // eslint-disable-line no-underscore-dangle
    state.isStoreRehydrated = store._persist.rehydrated; // eslint-disable-line no-underscore-dangle
  }

  return state;
};

export default withRedux(connect(mapStateToProps)(withAuth(NotebookPage)));
