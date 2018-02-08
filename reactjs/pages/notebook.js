import React, { Component } from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import NotebookTemplate from '../components/organisms/Templates/Notebook';
import Header from '../components/organisms/Header';

class NotebookPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-notebook">
          <NotebookTemplate {...this.props} />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request }) {
    const initialProps = {};
    return initialProps;
  }
}

export default withRedux(withAuth(NotebookPage));
