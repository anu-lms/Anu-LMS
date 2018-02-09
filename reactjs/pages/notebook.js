import React, { Component } from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import { store } from '../store/store';
import withRedux from '../store/withRedux';
import NotebookTemplate from '../components/organisms/Templates/Notebook';
import Header from '../components/organisms/Header';
import * as dataProcessors from '../utils/dataProcessors';
import * as notebookActions from '../actions/notebook';

class NotebookPage extends Component {
  componentDidMount() {
    this.props.notebook.forEach(note => {
      store.dispatch(notebookActions.AddNote(note));
    });
  }

  render() {
    const { notebook } = this.props;
    return (
      <App>
        <Header />
        <div className="page-with-header page-notebook">
          <NotebookTemplate notebook={notebook} />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, query, res }) {

    const initialProps = {
      notebook: [],
    };

    try {
     /* const responseNotebook = await request
        .get('/jsonapi/notebook/notebook')
        .query({
          // Sort by changed date.
          'sort': 'changed'
        });
      initialProps.notebook = dataProcessors.notebookData(responseNotebook.body.data);*/
    } catch (error) {
      if (res) res.statusCode = 404;
      console.log(error);
    }

    return initialProps;
  }
}

export default withRedux(withAuth(NotebookPage));
