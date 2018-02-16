import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes'
import Alert from 'react-s-alert';

const schema = {
  'type': 'object',
  'required': [],
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
      const { request } = await this.context.auth.getRequest();
      const tokenResponse = await request.get('/session/token');

      await request
        .patch('/user/75')
        .set('Content-Type', 'application/json')
        .set('X-CSRF-Token', tokenResponse.text)
        .send({
          pass: [{
            existing: "password1",
            value: "password"
          }],
        })

        .then(({ body }) => {
          console.log('get response');
          console.log('body', body);
          this.setState({ isSending: false });

        })
        .catch(error => {
          console.log('error', error);
          this.setState({ isSending: false });
        });
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
    getRequest: PropTypes.func,
  }),
};

export default PasswordForm;
