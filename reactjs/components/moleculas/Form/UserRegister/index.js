import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';

const schema = {
  'type': 'object',
  'required': ['username', 'email', 'firstName', 'lastName', 'password', 'password_confirm'],
  'properties': {
    'username': {
      'type': 'string',
      'title': 'Username',
    },
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
    this.setState({
      isSending: true,
    });
    console.log(formData);
    try {
      // Reset state after successful submit.
      this.setState({
        isSending: false,
        canBeSubmited: false,
      });

      Alert.success('Your profile has been successfully updated.');
    } catch (error) {
      this.setState({ isSending: false });
      Alert.error('We could not register user, please contact site administrator.');
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

UserRegisterForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UserRegisterForm);
