import React from 'react';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import request from '../../../../utils/request';
import { saveAuthData } from '../../../../utils/authentication';

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

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
      formData: {},
    };

    this.submitForm.bind(this);
  }

  submitForm({ formData }) {

    this.setState({
      isSending: true,
      formData,
    });

    request
      .post('/oauth/token')
      .send({
        'grant_type': 'password',
        // TODO: Move to constants.
        'client_id': '9e0c1ed1-541b-45da-9360-8b41f206352c',
        'client_secret': '9uGSd3khRDf3bxQR',
        'scope': '',
        'username': formData.username,
        'password': formData.password,
      })
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        this.setState({ isSending: false });
        if (!err) {
          saveAuthData(res.body.access_token, res.body.refresh_token, Date.now() + res.body.expires_in);
          this.setState({ formData: {} });

          // TODO: Remove.
          alert('Successfull authentication!');
        }
        else {
          // TODO: Handle error.
          console.log(err);
          console.log(res);
          // TODO: Remove.
          alert(res.body.message);
        }
      });
  }

  render() {
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

export default LoginForm;
