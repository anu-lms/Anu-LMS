import React, { Fragment } from 'react';
import UserRegisterForm from '../../../moleculas/Form/UserRegister';
import OneColumnLayout from '../../../../components/organisms/Templates/OneColumnLayout';

class UserRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: '',
    }
    this.onFormError = this.onFormError.bind(this);
  }

  onFormError(message) {
    this.setState({
      formError: message
    });
  }

  render() {
    const { tokenValidation } = this.props;
    const { formError } = this.state;
    return (
      <div>
        <OneColumnLayout pageTitle="Registration" className="short">
          {tokenValidation.isValid ? (
              <Fragment>
                {formError &&
                  <div className="form-error" dangerouslySetInnerHTML={{ __html: formError }} />
                }
                <div className="form-description">Registration form description.</div>
                <UserRegisterForm token={tokenValidation.token} onFormError={this.onFormError} />
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
