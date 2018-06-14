import React from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import request from '../../../../utils/request';

const schema = {
  'type': 'object',
  'required': ['username'],
  'properties': {
    'username': {
      'type': 'string',
      'title': 'Username or Email Address',
    },
  },
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
      isEmpty: true,
      formData: {},
    };

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange({ formData }) {
    let isEmpty = true;
    if (formData.username !== undefined && formData.username !== '') {
      isEmpty = false;
    }

    this.setState({ isEmpty, formData });
  }

  async submitForm({ formData }) {
    this.setState({
      isSending: true,
      formData,
    });

    try {
      const tokenResponse = await request.get('/session/token');
      await request
        .post('/user/password/request?_format=json')
        .set('Content-Type', 'application/json')
        // .set('X-CSRF-Token', tokenResponse.text)
        .send({
          username: formData.username,
        });

      this.setState({ isSending: false });

      this.props.recoveryEmailSent();
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
          disabled={this.state.isEmpty}
        >
          Send Reset Email
        </Button>
      </Form>
    );
  }
}

PasswordForm.propTypes = {
  recoveryEmailSent: PropTypes.func.isRequired,
};

export default PasswordForm;
