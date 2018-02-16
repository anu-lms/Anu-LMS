import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes'
import Alert from 'react-s-alert';

const schema = {
  'type': 'object',
  'required': ['username', 'password'],
  'properties': {
    'password': {
      'type': 'string',
      'title': 'Enter Current Password',
    },
    'password_new': {
      'type': 'string',
      'title': 'New Password',
    },
    'password_new_confirm': {
      'type': 'string',
      'title': 'Confirm New Password',
    },
  }
};

const uiSchema = {
  'password': {
    'ui:widget': 'password',
    'ui:placeholder': ' ',
  },
  'password_new': {
    'ui:widget': 'password',
    'ui:placeholder': ' ',
  },
  'password_new_confirm': {
    'ui:widget': 'password',
    'ui:placeholder': ' ',
  }
};

class PasswordForm extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isSending: false,
      formData: {},
    };

    this.submitForm.bind(this);
  }

  async submitForm({ formData }) {

    this.setState({
      isSending: true,
      formData,
    });

    try {
      await this.context.auth.login(formData.username, formData.password);
      Router.push('/dashboard');
    } catch (error) {
      this.setState({ isSending: false });
      Alert.error(error);
    }
  }

  render() {
    return(
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        autocomplete={'off'}
        onSubmit={this.submitForm.bind(this)}
        className="edit-password-form"
      >
        <Button loading={this.state.isSending}>
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

export default PasswordForm;
