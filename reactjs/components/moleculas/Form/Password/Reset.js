import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes'
import Alert from 'react-s-alert';
import * as dataProcessors from '../../../../utils/dataProcessors';
import request from "../../../../utils/request";

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
  }
};

const uiSchema = {
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
      const tokenResponse = await request.get('/session/token');
      await request
        .post('/user/password/reset')
        .set('Content-Type', 'application/json')
        .set('X-CSRF-Token', tokenResponse.text)
        .send({
          password_new: formData.password_new,
          ...this.props.tokenParams
        })
        .then((response) => {
          this.setState({ isSending: false });
          const user = dataProcessors.userData(response.body);

          // Re-login with new credentials.
          return this.context.auth.login(user.name, formData.password_new);
        });

      this.setState({ isSending: false });
      Router.push('/dashboard');
      Alert.success('Your password has been successfully updated.');
    } catch (error) {
      //Alert.error(error);
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
        noHtml5Validate
      >
        <Button loading={this.state.isSending}>
          Send Reset Email
        </Button>
      </Form>
    );
  }
}

PasswordForm.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
    login: PropTypes.func,
  }),
};

export default PasswordForm;
