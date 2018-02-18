import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../../application/App';
import Header from '../../components/organisms/Header';
import withAuth from '../../auth/withAuth';
import EditPassword from '../../components/organisms/Password/Edit';

class UserPasswordPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-password">
          <EditPassword />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, res }) {

    let initialProps = {
    };

    return initialProps;
  }
}

export default withAuth(UserPasswordPage);
