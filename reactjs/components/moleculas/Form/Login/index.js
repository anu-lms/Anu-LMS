import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import { Router } from '../../../../routes'
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import { setUser } from '../../../../actions/user';
import { userData } from '../../../../utils/dataProcessors';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';

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
  }
};

const uiSchema = {
  'username': {
    'ui:placeholder': ' ',
  },
  'password': {
    'ui:widget': PasswordWidget,
    'ui:placeholder': ' ',
  }
};

class LoginForm extends React.Component {

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
      await this.context.auth.login(formData.username, formData.password);
      const { request } = await this.context.auth.getRequest();
      const userResponse = await request.get('/user/me?_format=json');
      const currentUser = userData(userResponse.body);

      this.props.dispatch(setUser(currentUser));

      Router.push('/dashboard');
    } catch (error) {
      this.setState({ isSending: false });
      Alert.error(error);
    }
  }

  render() {
    console.log(this.props);
    return(
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        autocomplete={'off'}
        onSubmit={this.submitForm.bind(this)}
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

export default connect()(LoginForm);
