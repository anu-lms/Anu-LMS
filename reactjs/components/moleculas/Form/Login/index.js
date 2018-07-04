import React from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';
import * as userApi from '../../../../api/user';
import * as userActionHelpers from '../../../../actions/user';

const schema = {
  'type': 'object',
  'required': ['username', 'password'],
  'properties': {
    'username': {
      'type': 'string',
      'title': 'Username or email',
    },
    'password': {
      'type': 'string',
      'title': 'Password',
    },
  },
};

const uiSchema = {
  'username': {
    'ui:placeholder': ' ',
  },
  'password': {
    'ui:widget': PasswordWidget,
    'ui:placeholder': ' ',
  },
};

class LoginForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isSending: false,
      formData: {},
    };

    this.submitForm = this.submitForm.bind(this);
  }

  async submitForm({ formData }) {
    this.setState({
      isSending: true,
      formData,
    });

    try {
      await this.context.auth.login(formData.username, formData.password);

      // Make request to the backend to get current user info.
      const { request } = await this.context.auth.getRequest();
      const currentUser = await userApi
        .fetchCurrent(request)
        .catch(error => {
          throw Error(error.response.body.message);
        });

      // Store logged in user in application store.
      this.props.dispatch(userActionHelpers.login(currentUser));

      Router.push('/dashboard');
    } catch (error) {
      this.setState({ isSending: false });
      Alert.error(error);
    }
  }

  render() {
    return (
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        autocomplete="off"
        onSubmit={this.submitForm}
      >
        <Button block loading={this.state.isSending}>
          Login
        </Button>
      </Form>
    );
  }
}

LoginForm.contextTypes = {
  auth: PropTypes.shape({
    login: PropTypes.func,
    getRequest: PropTypes.func,
  }),
};

LoginForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(LoginForm);
