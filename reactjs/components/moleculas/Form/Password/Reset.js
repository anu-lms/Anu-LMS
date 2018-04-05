import React from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes';
import request from '../../../../utils/request';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';
import * as dataProcessors from '../../../../utils/dataProcessors';

const schema = {
  'type': 'object',
  'required': ['password_new', 'password_new_confirm'],
  'properties': {
    'password_new': {
      'type': 'string',
      'title': 'New Password',
    },
    'password_new_confirm': {
      'type': 'string',
      'title': 'Confirm New Password',
    },
  },
};

const uiSchema = {
  'password_new': {
    'ui:widget': PasswordWidget,
    'ui:placeholder': ' ',
    'ui:indicator': true,
    'ui:with_confirm_field': true,
  },
  'password_new_confirm': {
    'ui:widget': PasswordWidget,
    'ui:placeholder': ' ',
  },
};

class PasswordForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      canBeSubmited: false,
      isSending: false,
      formData: {},
    };

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange({ formData }) {
    let canBeSubmited = true;
    if (formData.password_new === undefined || formData.password_new === '') {
      canBeSubmited = false;
    }
    if (formData.password_new_confirm === undefined || formData.password_new_confirm === '') {
      canBeSubmited = false;
    }

    this.setState({ canBeSubmited, formData });
  }

  async submitForm({ formData }) {
    if (formData.password_new !== formData.password_new_confirm) {
      Alert.error("New password and Confirm New Password fields don't match");
      return;
    }
    this.setState({
      isSending: true,
      formData,
    });

    try {
      const tokenResponse = await request.get('/session/token');
      await request
        .post('/user/password/reset?_format=json')
        .set('Content-Type', 'application/json')
        .set('X-CSRF-Token', tokenResponse.text)
        .send({
          password_new: formData.password_new,
          ...this.props.tokenParams,
        })
        .then(response => {
          this.setState({ isSending: false });
          const user = dataProcessors.userData(response.body);

          // Re-login with new credentials.
          return this.context.auth.login(user.name, formData.password_new);
        });

      this.setState({ isSending: false });
      Alert.success('Your password has been successfully updated.');
      Router.replace('/dashboard');
    } catch (error) {
      if (error.response && error.response.body && error.response.body.message) {
        console.error(error.response);
        Alert.error(error.response.body.message);
      }
      else {
        Alert.error('Could not send a request. Please, try again.');
        console.error(error);
      }
      this.setState({ isSending: false });
    }
  }

  render() {
    return (
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        autocomplete="off"
        onChange={this.onChange}
        onSubmit={this.submitForm}
        className="edit-password-form"
        noHtml5Validate
      >
        <Button
          loading={this.state.isSending}
          disabled={!this.state.canBeSubmited}
        >
          Save New Password
        </Button>
      </Form>
    );
  }
}

PasswordForm.contextTypes = {
  auth: PropTypes.shape({
    login: PropTypes.func,
  }),
};

PasswordForm.propTypes = {
  tokenParams: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PasswordForm;
