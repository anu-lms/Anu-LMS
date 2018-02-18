import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../../application/App';
import Header from '../../components/organisms/Header';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';
import ForgotPassword from '../../components/organisms/Password/Forgot';

class ForgotPasswordPage extends Component {

  render() {
    return (
      <App>
        <Header isEmpty={true}/>
        <div className="page-with-header page-password">
          <OneColumnLayout pageTitle="Forgot Password?">

            <ForgotPassword />
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

export default ForgotPasswordPage;
