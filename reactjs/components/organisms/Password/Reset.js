import React, { Fragment } from 'react';
import PasswordForm from '../../moleculas/Form/Password';
import { connect } from 'react-redux';
import { Router } from "../../../routes";
import OneColumnLayout from '../../../components/organisms/Templates/OneColumnLayout';

class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {  } = this.props;

    return (
      <OneColumnLayout pageTitle="Set a New Password">
        <PasswordForm/>
      </OneColumnLayout>
    );
  }
}

export default ResetPassword;
