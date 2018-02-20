import React from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import * as dataProcessors from '../../../../utils/dataProcessors';

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
      // Get superagent request with authentication.
      const { request } = await this.context.auth.getRequest();
      const userResponse = await request.get('/user/me?_format=json');
      const currentUser = dataProcessors.userData(userResponse.body);

      await request
        .patch('/jsonapi/user/user/' + currentUser.uuid)
        .send({
          data: {
            type: 'user--user',
            id: currentUser.uuid,
            attributes: {
              pass: {
                existing: formData.password,
                value: formData.password_new
              }
            }
          }
        });

      Alert.success('Your password has been successfully updated.');
      this.setState({ isSending: false, formData: {} });

      // Re-login required if user data has changed.
      // Use login instead of refresh token here, because refreshtoken is buggy sometimes.
      await this.context.auth.login(currentUser.name, formData.password_new);
    } catch (error) {
      Alert.error('We could not update your password. Please, make sure current password is correct.');
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
          Save New Password
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
