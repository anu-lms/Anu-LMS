import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../application/App';
import Header from '../components/organisms/Header';
import withAuth from '../auth/withAuth';

class UserPassword extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header page-notebook">
          <div>aaa</div>
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
