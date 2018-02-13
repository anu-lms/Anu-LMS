import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import NotebookTemplate from '../components/organisms/Templates/Notebook';
import Header from '../components/organisms/Header';
import * as dataProcessors from '../utils/dataProcessors';
import * as notebookActions from "../actions/notebook";
import * as notebookHelpers from "../helpers/notebook";

class NotebookPage extends Component {

  componentDidMount = () => {
    this.initializeNotebook();
  }

  componentDidUpdate = () => {
    this.initializeNotebook();
  }

  initializeNotebook() {
    const { isStoreRehydrated, notes, dispatch } = this.props;
    if (isStoreRehydrated) {

      // Reset all existing notes in the notebook.
      // TODO: Skip unsaved?
      dispatch(notebookActions.clear());

      // Add all notes from the backend to the notebook storage.
      notes.forEach(note => {
        dispatch(notebookActions.addNote(note));
      });

      // Automatically set the first note as active for editing.
      if (notes.length > 0) {
        dispatch(notebookActions.setActiveNote(notes[0].id));
      }
    }
  }

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-notebook">
          <NotebookTemplate />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, res }) {

    let initialProps = {
      notes: []
    };

    try {
      const responseNotebook = await request
        .get('/jsonapi/notebook/notebook')
        .query({
          // Sort by changed date.
          'sort': '-changed'
        });

      initialProps.notes = dataProcessors.notebookData(responseNotebook.body.data);
    } catch (error) {
      if (res) res.statusCode = 404;
      console.log(error);
    }

    // If no notes available on the backend - add a welcome note by default.
    if (initialProps.notes.length === 0) {
      try {
        const title = 'Taking Notes';
        const body = '<p><strong>Welcome to your personal notebook!</strong> This is your space to record and reflect.</p><p></p><p>Format text using the options above for <strong>bold</strong>, <em>italics</em>, and <u>underline.</u></p><ul><li>Create lists with bullet points or numbers!</li></ul><p><u>Notes are saved automatically</u>, so don’t worry about losing anything by accident.</p><p></p><p>If you decide to delete a note, simply select “Delete Note” from the menu options at the top right corner of this page (the 3 dots icon).</p><p></p><p><strong>Take a new note with the “Add New” icon at the top of your notebook!</strong></p>';
        const note = await notebookHelpers.createNote(request, title, body);
        initialProps.notes = [note];
      } catch (error) {
        console.log('Could not create a welcome note.');
        console.log(error);
      }
    }

    return initialProps;
  }
}

const mapStateToProps = (store) => {
  let state = {
    isStoreRehydrated: false,
  };

  if (typeof store._persist !== 'undefined') {
    state.isStoreRehydrated = store._persist.rehydrated;
  }

  return state;
};

export default withRedux(connect(mapStateToProps)(withAuth(NotebookPage)));
