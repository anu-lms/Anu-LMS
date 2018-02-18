import React, { Fragment } from 'react';
import EditPasswordForm from '../../moleculas/Form/Password';
import { connect } from 'react-redux';
import { Router } from "../../../routes";
import OneColumnLayout from '../../../components/organisms/Templates/OneColumnLayout';

class EditPassword extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {  } = this.props;

    return (
      <OneColumnLayout pageTitle="Edit Password">
        <EditPasswordForm/>
      </OneColumnLayout>
    );
  }
}

export default EditPassword;
