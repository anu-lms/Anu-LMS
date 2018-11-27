import React, { Fragment } from 'react';
import ForgotPasswordForm from '../../../moleculas/Form/Password/Forgot';
import OneColumnLayout from '../../../../components/organisms/Templates/OneColumnLayout';

/* eslint-disable max-len */
class UserRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmailSent: false,
    };

    this.recoveryEmailSent = this.recoveryEmailSent.bind(this);
  }

  recoveryEmailSent() {
    this.setState({ isEmailSent: true });
  }

  render() {
    const { isEmailSent } = this.state;
    const pageTitle = isEmailSent ? 'Recovery Email Sent' : 'Registration';
    const layoutClasses = isEmailSent ? 'page-title-green' : 'short';
    return (
      <div>
        <OneColumnLayout pageTitle={pageTitle} className={layoutClasses}>
          {!isEmailSent &&
            <Fragment>
              <div className="form-description">Enter your username or email address below, and we’ll send you an email with a link to reset your password.</div>
              <ForgotPasswordForm recoveryEmailSent={this.recoveryEmailSent} />
            </Fragment>
          }

          {isEmailSent &&
            <div>Thank you! An email has been sent to your email address with a link to reset your password.</div>
          }
        </OneColumnLayout>
      </div>
    );
  }
}

export default UserRegister;
