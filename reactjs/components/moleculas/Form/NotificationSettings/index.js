import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import * as lock from '../../../../utils/lock';
import * as userApi from '../../../../api/user';
import * as userActionHelpers from '../../../../actions/user';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';

const schema = {
  'type': 'object',
  'properties': {
    'tagging': {
      'type': 'object',
      'title': 'Tagging',
      'properties': {
        'notify_if_tagged': {
          'name': 'notify_if_tagged',
          'disabled': true,
          'type': 'boolean',
          'title': 'Notify me when someone tags me in a comment.',
        },
      },
    },
    'responses': {
      'type': 'object',
      'title': 'Responses',
      'properties': {
        'notify_if_replied': {
          'name': 'notify_if_replied',
          'disabled': true,
          'type': 'boolean',
          'title': 'Notify me when someone responds to my comment.',
        },
      },
    },
  },
};

const uiSchema = {
  'tagging': {
    'notify_if_tagged': {
      // 'ui:disabled': true,
    },
  },
  'responses': {
    'notify_if_replied': {
      // 'ui:disabled': true,
    },
  },
};

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
    console.log(e);
    // e.persist();
    const { user } = this.props;

    // this.setState({
    //   isSending: e.target.name,
    //   [e.target.name]: e.target.checked,
    // });
    //
    // // Get superagent request with authentication.
    // const { request } = await this.context.auth.getRequest();
    //
    // // Makes request to the backend to update notifiaction settings.
    // await userApi.update(request, user.uuid, {
    //   [`field_${e.target.name}`]: e.target.checked,
    // });
    //
    // this.setState({
    //   isSending: null,
    // });
    //
    // // Refresh authentication token because user data has changed.
    // await this.context.auth.refreshAuthenticationToken();
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        onChange={this.onChange}
        onSubmit={this.submitForm}
        className="notification-settings-form"
      >
        <div />
      </Form>
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
