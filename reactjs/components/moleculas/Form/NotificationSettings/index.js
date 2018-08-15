import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as userApi from '../../../../api/user';

class NotificationSettingsForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    const { user } = this.props;

    this.state = {
      isSending: false,
      notify_if_tagged: user.notifyIfTagged,
      notify_if_replied: user.notifyIfReplied,
    };

    this.onChange = this.onChange.bind(this);
  }

  async onChange(e) {
    e.persist();
    const { user } = this.props;

    this.setState({
      isSending: true,
      [e.target.name]: e.target.checked,
    });

    // Get superagent request with authentication.
    const { request } = await this.context.auth.getRequest();

    // Makes request to the backend to update notifiaction settings.
    await userApi.update(request, user.uuid, {
      [`field_${e.target.name}`]: e.target.checked,
    });

    // Refresh authentication token because user data has changed.
    await this.context.auth.refreshAuthenticationToken();

    this.setState({
      isSending: false,
    });
  }

  render() {
    const { isSending, notify_if_tagged, notify_if_replied } = this.state;
    console.log(this.props);
    console.log(this.state);
    return (
      <form className="notification-settings-form">
        <fieldset>
          <legend>Tagging</legend>

          <div className={classNames('checkbox', { 'disabled': isSending })}>
            <label>
              <input
                onChange={this.onChange}
                checked={notify_if_tagged}
                disabled={isSending}
                type="checkbox"
                name="notify_if_tagged"
              />
              <span>Notify me when someone tags me in a comment.</span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Responses</legend>

          <div className={classNames('checkbox', { 'disabled': isSending })}>
            <label>
              <input
                onChange={this.onChange}
                checked={notify_if_replied}
                disabled={isSending}
                type="checkbox"
                name="notify_if_replied"
              />
              <span>Notify me when someone responds to my comment.</span>
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
