import React from 'react';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';

const schema = {
  'type': 'object',
  'required': ['username', 'password'],
  'properties': {
    'username': {
      'type': 'string',
      'title': 'Username',
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
    'ui:widget': 'password',
    'ui:placeholder': ' ',
  }
};

class LoginForm extends React.Component {

  render() {

    return(
      <Form
        schema={schema}
        uiSchema={uiSchema}
        autocomplete={'off'}
      >
        <Button block>Login</Button>
      </Form>
    );
  }
}

export default LoginForm;
