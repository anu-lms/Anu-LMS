import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes'
import Alert from 'react-s-alert';

const schema = {
  'type': 'object',
  'required': ['username', 'email', 'password'],
  'properties': {
    'username': {
      'type': 'string',
      'title': 'Username',
    },
    'email': {
      'type': 'string',
      'format': 'email',
      'title': 'Email Address',
    },
    'password': {
      'type': 'string',
      'title': 'Enter Password',
    }
  }
};

const uiSchema = {
  'username': {
    'ui:placeholder': ' ',
  },
  'email': {
    'classNames': 'with-password-description',
    'ui:placeholder': ' ',
    'ui:description': 'Please confirm your password to update your profile:'
  },
  'password': {
    'ui:widget': 'password',
    'ui:placeholder': ' '
  },
};

class UserEditForm extends React.Component {

  constructor(props, context) {
    super(props, context);

    const { user } = this.props;

    this.state = {
      isSending: false,
      isChanged: false,
      user: user,
      formData: {
        username: user.name,
        email: user.mail,
        password: ''
      },
    };

    this.submitForm.bind(this);
  }

  async submitForm({ formData }) {

    this.setState({
      isSending: true,
      formData,
    });

    try {
      // Get superagent request with authentication.
      const { request } = await this.context.auth.getRequest();
      const { user } = this.state;

      // Update user data.
      await request
        .patch('/jsonapi/user/user/' + user.uuid)
        .send({
          data: {
            type: 'user--user',
            id: user.uuid,
            attributes: {
              name: formData.username,
              mail: formData.email,
              pass: {
                existing: formData.password
              }
            }
          }
        });

      // Re-login required if user name has changed.
      await this.context.auth.login(formData.username, formData.password);

      // Update state accourdingly to make further updates possible.
      this.setState({
        isSending: false,
        user: {
          ...user,
          name: formData.username,
          mail: formData.email,
        },
        formData: {
          ...formData,
          password: ''
        }
      });

      Alert.success('Your profile has been successfully updated.');

    } catch (error) {
      this.setState({ isSending: false });
      Alert.error('We could not update your profile. Please, make sure current password is correct and try again.');
    }
  }

  onChange({ formData }) {
    const { user } = this.state;

    // Set isChanged flag based on user input to enable/disable Save button.
    if (formData.username !== user.name) {
      this.setState({ isChanged: true, formData });
    }
    else if (formData.email !== user.mail) {
      this.setState({ isChanged: true, formData });
      return formData;
    }
    else {
      this.setState({ isChanged: false, formData });
    }
  }

  render() {

    return (
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        autocomplete={'off'}
        onChange={this.onChange.bind(this)}
        onSubmit={this.submitForm.bind(this)}
      >
        <Button
          block
          loading={this.state.isSending}
          disabled={!this.state.isChanged}
        >
          Save
        </Button>
      </Form>
    );
  }
}

UserEditForm.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
    login: PropTypes.func,
  }),
};

export default UserEditForm;
