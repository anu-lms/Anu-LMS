import React, { Fragment } from 'react';
import EditPasswordForm from '../../moleculas/Form/Password';
import { connect } from 'react-redux';
import { Router } from "../../../routes";

class EditPassword extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { notes, activeNote, isMobileContentVisible } = this.props;

    return (
      <Fragment>
        <EditPasswordForm/>
      </Fragment>
    );
  }
}

export default EditPassword;
