import React, { Component } from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import NotebookTemplate from '../components/organisms/Templates/Notebook';
import Header from '../components/organisms/Header';
import * as dataProcessors from '../utils/dataProcessors';

class NotebookPage extends Component {

  render() {
    const { notebook } = this.props;
    console.log(notebook);
    return (
      <App>
        <Header />
        <div className="page-with-header page-notebook">
          <NotebookTemplate course={notebook} />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, query, res }) {

    const initialProps = {
      notebook: {},
    };

    try {
      const responseNotebook = await request
        .get('/jsonapi/notebook/notebook')
        .query({
          // Sort by changed date.
          'sort': 'changed'
        });
      initialProps.notebook = dataProcessors.notebookData(responseNotebook.body.data);
    } catch (error) {
      if (res) res.statusCode = 404;
      console.log(error);
    }

    return initialProps;
  }
}

export default withRedux(withAuth(NotebookPage));
