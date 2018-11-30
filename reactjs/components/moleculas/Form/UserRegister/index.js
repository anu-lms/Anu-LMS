import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';
import { Router } from '../../../../routes';
import request from '../../../../utils/request';
import * as userApi from '../../../../api/user';
import * as userActionHelpers from '../../../../actions/user';

const schema = {
  'type': 'object',
  'required': ['username', 'email', 'firstName', 'lastName', 'password', 'password_confirm'],
  'properties': {
    'firstName': {
      'type': 'string',
      'title': 'First Name',
    },
    'lastName': {
      'type': 'string',
      'title': 'Last Name',
    },
    'email': {
      'type': 'string',
      'format': 'email',
      'title': 'Email Address',
    },
    'username': {
      'type': 'string',
      'title': 'Username',
    },
    'password': {
      'type': 'string',
      'title': 'Password',
    },
    'password_confirm': {
      'type': 'string',
      'title': 'Confirm Password',
    },
  },
};

const uiSchema = {
  'username': {
    'ui:placeholder': ' ',
  },
  'email': {
    'ui:placeholder': ' ',
  },
  'firstName': {
    'ui:placeholder': ' ',
  },
  'lastName': {
    'ui:placeholder': ' ',
  },
  'password': {
    'ui:widget': PasswordWidget,
    'ui:placeholder': ' ',
    'ui:indicator': true,
    'ui:with_confirm_field': true,
  },
  'password_confirm': {
    'ui:widget': PasswordWidget,
    'ui:placeholder': ' ',
  },
};

class UserRegisterForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isSending: false,
      canBeSubmited: false,
      formData: {},
    };

    this.submitForm = this.submitForm.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange({ formData }) {
    // Set canBeSubmited flag based on user input to enable/disable Save button.
    let canBeSubmited = true;
    if (formData.username === undefined || formData.username === '') {
      canBeSubmited = false;
    }
    if (formData.firstName === undefined || formData.firstName === '') {
      canBeSubmited = false;
    }
    if (formData.lastName === undefined || formData.lastName === '') {
      canBeSubmited = false;
    }
    if (formData.email === undefined || formData.email === '') {
      canBeSubmited = false;
    }
    if (formData.password === undefined || formData.password === '') {
      canBeSubmited = false;
    }
    if (formData.password_confirm === undefined || formData.password_confirm === '') {
      canBeSubmited = false;
    }

    this.setState({ canBeSubmited, formData });
  }

  async submitForm({ formData }) {
    const { token, onFormError } = this.props;
    if (formData.password !== formData.password_confirm) {
      Alert.error('The specified passwords do not match.');
      return;
    }
    this.setState({
      isSending: true,
      formData,
    });

    try {
      const data = {
        ...formData,
        token,
      };

      // Make request to the backend to register new user.
      const user = await userApi.registerUser(
        request,
        data,
      );

      // Store logged in user in application store.
      this.props.dispatch(userActionHelpers.login(user));

      // Login to the site.
      await this.context.auth.login(user.name, formData.password);

      Router.replace('/dashboard');
    }
    catch (error) {
      if (error.response && error.response.body && error.response.body.message) {
        console.error(error.response);
        if (error.response.body.error_type === 'email_exists' || error.response.body.error_type === 'username_exists') {
          const field = error.response.body.error_type === 'email_exists' ? 'email address' : 'username';
          onFormError(`This ${field} is already taken. If you have already registered, you may <a href="/">sign in here</a>. If you have forgotten your username or password, <a href="/user/forgot">please click here</a>.`);
        }
        else {
          Alert.error(error.response.body.message);
        }
      }
      else {
        Alert.error('Could not send a request. Please, try again.');
        console.error(error);
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
        noHtml5Validate
      >
        <div className="mt-3 mt-md-5">
          <Button
            block
            loading={this.state.isSending}
            disabled={!this.state.canBeSubmited}
          >
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

UserRegisterForm.contextTypes = {
  auth: PropTypes.shape({
    login: PropTypes.func,
    getRequest: PropTypes.func,
  }),
};

UserRegisterForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UserRegisterForm);
