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
      dispatch(notebookActions.clear());
      notes.forEach(note => {
        dispatch(notebookActions.addNote(note));
      });
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
