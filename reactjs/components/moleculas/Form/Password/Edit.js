import React from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';
import * as dataProcessors from '../../../../utils/dataProcessors';
import * as lock from '../../../../utils/lock';

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
  },
};

const uiSchema = {
  'password': {
    'ui:widget': PasswordWidget,
    'ui:placeholder': ' ',
  },
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
    if (formData.password === undefined || formData.password === '') {
      canBeSubmited = false;
    }
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

    // Lock logout until update operation is safely completed.
    const lockId = lock.add('user-update-pass');

    try {
      // Get superagent request with authentication.
      const { request } = await this.context.auth.getRequest();
      // @todo: replace with userApi.fetchCurrent().
      const userResponse = await request.get('/user/me?_format=json');
      const currentUser = dataProcessors.userData(userResponse.body);

      await request
        .patch(`/jsonapi/user/user/${currentUser.uuid}`)
        .send({
          data: {
            type: 'user--user',
            id: currentUser.uuid,
            attributes: {
              pass: {
                existing: formData.password,
                value: formData.password_new,
              },
            },
          },
        });

      Alert.success('Your password has been successfully updated.');
      this.setState({ isSending: false });

      // Re-login required if user data has changed.
      // Use login instead of refresh token here, because refreshtoken is buggy sometimes.
      await this.context.auth.login(currentUser.name, formData.password_new);
    } catch (error) {
      Alert.error('We could not update your password. Please, make sure current password is correct.');
      console.error(error);
      this.setState({ isSending: false });
    }

    lock.release(lockId);
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
    getRequest: PropTypes.func,
    login: PropTypes.func,
  }),
};

export default PasswordForm;
