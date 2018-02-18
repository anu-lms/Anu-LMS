import React, { Fragment } from 'react';
import PasswordForm from '../../moleculas/Form/Password';
import { connect } from 'react-redux';
import { Router } from "../../../routes";

class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { notes, activeNote, isMobileContentVisible } = this.props;

    return (
      <Fragment>
        <PasswordForm/>
      </Fragment>
    );
  }
}

export default ForgotPassword;
