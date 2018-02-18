import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes'
import Alert from 'react-s-alert';

const schema = {
  'type': 'object',
  'required': ['password', 'password_new', 'password_new_confirm'],
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
    if (formData.password_new !== formData.password_new_confirm) {
      Alert.error("New password and Confirm New Password fields don't match");
      return;
    }

    this.setState({
      isSending: true,
      formData,
    });

    try {
      const { request } = await this.context.auth.getRequest();
      const tokenResponse = await request.get('/session/token');
      const currentUser = await request.get('/current_user?_format=json');

      await request
        .patch('/user/' + currentUser.body.uid[0].value)
        .set('Content-Type', 'application/json')
        .set('X-CSRF-Token', tokenResponse.text)
        .send({
          pass: [{
            existing: formData.password,
            value: formData.password_new
          }],
        })
        .then(() => {
          Alert.success('Your password has been successfully updated.');
          this.setState({ isSending: false, formData: {} });
          return this.context.auth.refreshAuthenticationToken();
        })
        .catch(error => {
          Alert.error('We could not update your password. Please, make sure current password is correct.');
          console.log(error);
          this.setState({ isSending: false });
        });
    } catch (error) {
      Alert.error(error);
      console.error(error);
      this.setState({ isSending: false });
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
    getRequest: PropTypes.func,
    refreshAuthenticationToken: PropTypes.func,
  }),
};

export default PasswordForm;
