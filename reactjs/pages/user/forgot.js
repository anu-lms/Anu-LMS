import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../../application/App';
import withAuth from '../../auth/withAuth';
import Header from '../../components/organisms/Header';
import ForgotPassword from '../../components/organisms/Password/Forgot';

class ForgotPasswordPage extends Component {
  static skipAuthRedirect = true;

  render() {
    return (
      <App>
        <Header isEmpty={true}/>
        <div className="page-with-header page-reset-password">
          <ForgotPassword />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, query, res }) {
    console.log(query);
    let initialProps = {

    };

    return initialProps;
  }
}

export default withAuth(ForgotPasswordPage);
