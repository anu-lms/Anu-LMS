import React, { Component } from 'react';
import * as dataProcessors from '../../utils/dataProcessors';
import App from '../../application/App';
import withAuth from '../../auth/withAuth';
import withRedux from '../../store/withRedux';
import Dashboard from '../../components/organisms/Templates/Dashboard';
import Header from '../../components/organisms/Header';

class UserEditPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header">
          Profile edit form...
        </div>
      </App>
    );
  }

  static async getInitialProps({ request }) {

  }
}

export default withRedux(withAuth(UserEditPage));
