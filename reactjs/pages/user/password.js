import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../../application/App';
import Header from '../../components/organisms/Header';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';
import withAuth from '../../auth/withAuth';
import Password from '../../components/organisms/Templates/Password';

class UserPasswordPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-password">
          <OneColumnLayout pageTitle="Edit Password">

            <Password />
          </OneColumnLayout>
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
