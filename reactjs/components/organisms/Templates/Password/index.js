import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PasswordForm from '../../../moleculas/Form/Password';
import { connect } from 'react-redux';
import { Router } from "../../../../routes";

class PasswordTemplate extends React.Component {

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

export default PasswordTemplate;
