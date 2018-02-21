import { connect } from 'react-redux';
import React, { Fragment } from 'react';
import { Router } from "../../../routes";
import ForgotPasswordForm from '../../moleculas/Form/Password/Forgot';
import OneColumnLayout from '../../../components/organisms/Templates/OneColumnLayout';

class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isEmailSent: false,
    };

    this.recoveryEmailSent.bind(this);
  }

  recoveryEmailSent(email) {
    this.setState({ isEmailSent: true, email: email });
  }

  render() {
    const {isEmailSent, email} = this.state;
    const pageTitle = isEmailSent ? 'Recovery Email Sent' : 'Forgot Password?';
    const layoutClasses = isEmailSent ? 'page-title-green' : 'short';
    return (
      <div>
        <OneColumnLayout pageTitle={pageTitle} className={layoutClasses}>
          {!isEmailSent &&
            <Fragment>
              <div className="form-description">Enter your username or email address below, and we’ll send you an email with a link to reset your password.</div>
              <ForgotPasswordForm recoveryEmailSent={this.recoveryEmailSent.bind(this)} />
            </Fragment>
          }

          {isEmailSent &&
            <div>Thank you! An email has been sent to <b>{email}</b> with a link to reset your password.</div>
          }
        </OneColumnLayout>
      </div>
    );
  }
}

export default ForgotPassword;
