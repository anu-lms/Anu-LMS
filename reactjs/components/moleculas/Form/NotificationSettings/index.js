import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import * as lock from '../../../../utils/lock';
import * as userApi from '../../../../api/user';
import * as userActionHelpers from '../../../../actions/user';

class NotificationSettingsForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isSending: false,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    console.log(e.target);
  }

  render() {
    console.log(this.props);
    return (
      <form className="notification-settings-form">
        <fieldset>
          <legend>Tagging</legend>

          <div className="checkbox">
            <label>
              <input onChange={this.onChange} type="checkbox" name="notify_if_tagged" />
              <span />Notify me when someone tags me in a comment.
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Responses</legend>

          <div className="checkbox">
            <label>
              <input onChange={this.onChange} type="checkbox" name="notify_if_replied" />
              <span />Notify me when someone responds to my comment.
            </label>
          </div>
        </fieldset>
      </form>
    );
  }
}

NotificationSettingsForm.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
    login: PropTypes.func,
  }),
};

export default NotificationSettingsForm;
