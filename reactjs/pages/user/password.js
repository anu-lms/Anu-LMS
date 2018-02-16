import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../../application/App';
import Header from '../../components/organisms/Header';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';
import withAuth from '../../auth/withAuth';
import LoginForm from '../../components/moleculas/Form/Login';

class UserPasswordPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-password">
          <OneColumnLayout pageTitle="Edit Password">

            <LoginForm />
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
