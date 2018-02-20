import { connect } from 'react-redux';
import App from '../../application/App';
import React, { Component } from 'react';
import withAuth from '../../auth/withAuth';
import Header from '../../components/organisms/Header';
import EditPasswordForm from '../../components/moleculas/Form/Password/Edit';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';

class UserPasswordPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-password">
          <OneColumnLayout pageTitle="Edit Password" className="short">
            <EditPasswordForm />
          </OneColumnLayout>
        </div>
      </App>
    );
  }
}

export default withAuth(UserPasswordPage);
