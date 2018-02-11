import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import NotebookTemplate from '../components/organisms/Templates/Notebook';
import Header from '../components/organisms/Header';
import * as dataProcessors from '../utils/dataProcessors';
import * as notebookActions from "../actions/notebook";

const mapStateToProps = (store) => {
  let state = {
    isStoreRehydrated: false,
  };

  if (typeof store._persist !== 'undefined') {
    state.isStoreRehydrated = store._persist.rehydrated;
  }

  return state;
};

// TODO: Figure out how to merge this class into the page.
@connect(mapStateToProps)
class NotebookPageStore extends React.Component {

  componentDidUpdate = () => {
    const { isStoreRehydrated, notes, dispatch } = this.props;
    if (isStoreRehydrated) {

      // Reset all existing notes in the notebook (apart from unsaved).
      dispatch(notebookActions.clear());

      // Add all notes from the backend to the notebook storage.
      notes.forEach(note => {
        dispatch(notebookActions.addNote(note));
      });

      // If no notes available on the backend - add a welcome note by default.
      if (notes.length === 0) {
        const title = 'Taking Notes';
        const body = '<p><strong>Welcome to your personal notebook!</strong> This is your space to record and reflect.</p><p></p><p>Format text using the options above for <strong>bold</strong>, <em>italics</em>, and <u>underline.</u></p><ul><li>Create lists with bullet points or numbers.</li></ul><p><u>Notes are saved automatically</u>, so don’t worry about losing anything by accident.</p><p></p><p>If you decide to delete a note, simply select “Delete Note” from the menu options at the top right corner of this page (the 3 dots icon).</p><p></p><p><strong>Take a new note with the “Add New” icon at the top of your notebook!</strong></p>';
        dispatch(notebookActions.addNewNote(title, body));
      }
    }
  };

  render() {
    return <NotebookTemplate />;
  }
}

class NotebookPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-notebook">
          <NotebookPageStore notes={this.props.notes} />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, res }) {

    let initialProps = {
      notes: [],
    };

    try {
      const responseNotebook = await request
        .get('/jsonapi/notebook/notebook');

      initialProps.notes = dataProcessors.notebookData(responseNotebook.body.data);
    } catch (error) {
      if (res) res.statusCode = 404;
      console.log(error);
    }

    return initialProps;
  }
}

export default withRedux(withAuth(NotebookPage));
