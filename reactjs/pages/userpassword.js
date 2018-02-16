import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../application/App';
import Header from '../components/organisms/Header';
import OneColumnLayout from '../components/organisms/Templates/OneColumnLayout';
import withAuth from '../auth/withAuth';

class UserPassword extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-password">
          <OneColumnLayout pageTitle="Edit Password">

            <div>aaa</div>

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

export default withAuth(UserPassword);
