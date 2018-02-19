import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes'
import Alert from 'react-s-alert';
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
      await request
        .post('/user/password/request')
        .set('Content-Type', 'application/json')
        .set('X-CSRF-Token', tokenResponse.text)
        .send({
          username: formData.username,
        })
        .then((response) => {
          console.log(response);
          this.setState({ isSending: false });
          Alert.success('Your password has been successfully updated.');

          // @todo: Is it secure to show email by given username?
          this.props.recoveryEmailSent(response.body.email);
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
          Send Reset Email
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
