import React from 'react';
import Alert from 'react-s-alert';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes';
import request from "../../../../utils/request";

const schema = {
  'type': 'object',
  'required': ['username'],
  'properties': {
    'username': {
      'type': 'string',
      'title': 'Username or Email Address',
    },
  }
};

const uiSchema = {
  'username': {
    'ui:placeholder': ' ',
  },
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
      const tokenResponse = await request.get('/session/token');
      const response = await request
        .post('/user/password/request?_format=json')
        .set('Content-Type', 'application/json')
        .set('X-CSRF-Token', tokenResponse.text)
        .send({
          username: formData.username,
        });

      this.setState({ isSending: false });

      // @todo: Is it secure to show email by given username?
      this.props.recoveryEmailSent(response.body.email);
    } catch (error) {
      if (error.response && error.response.body && error.response.body.message) {
        console.error(error.response);
        Alert.error(error.response.body.message);
      }
      else {
        Alert.error('Could not send a request. Please, try again.');
      }
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

export default PasswordForm;
