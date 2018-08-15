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
    const { user } = this.props;

    this.state = {
      isSending: null,
      notify_if_tagged: user.notifyIfTagged,
      notify_if_replied: user.notifyIfReplied,
    };

    this.onChange = this.onChange.bind(this);
  }

  async onChange(e) {
    e.persist();
    const { user } = this.props;

    this.setState({
      isSending: e.target.name,
      [e.target.name]: e.target.checked,
    });

    // Get superagent request with authentication.
    const { request } = await this.context.auth.getRequest();

    // Makes request to the backend to update notifiaction settings.
    await userApi.update(request, user.uuid, {
      [`field_${e.target.name}`]: e.target.checked,
    });

    this.setState({
      isSending: null,
    });

    // Refresh authentication token because user data has changed.
    await this.context.auth.refreshAuthenticationToken();
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <form className="notification-settings-form">
        <fieldset>
          <legend>Tagging</legend>

          <div className="checkbox">
            <label>
              <input onChange={this.onChange} checked={this.state.notify_if_tagged} type="checkbox" name="notify_if_tagged" />
              <span />Notify me when someone tags me in a comment.
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Responses</legend>

          <div className="checkbox">
            <label>
              <input onChange={this.onChange} checked={this.state.notify_if_replied} type="checkbox" name="notify_if_replied" />
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
