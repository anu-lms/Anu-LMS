import React, { Fragment } from 'react';
import UserRegisterForm from '../../../moleculas/Form/UserRegister';
import OneColumnLayout from '../../../../components/organisms/Templates/OneColumnLayout';

class UserRegister extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tokenValidation = this.props.tokenValidation;
    return (
      <div>
        <OneColumnLayout pageTitle="Registration" className="short">
          {tokenValidation.isValid ? (
              <Fragment>
                <div className="form-description">Enter your username or email address below, and we’ll send you an email with a link to reset your password.</div>
                <UserRegisterForm />
              </Fragment>
            ) : (
              <div>{tokenValidation.errorMessage}</div>
            )
          }
        </OneColumnLayout>
      </div>
    );
  }
}

export default UserRegister;
