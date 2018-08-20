import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import Alert from 'react-s-alert';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import * as lock from '../../../../utils/lock';
import * as userApi from '../../../../api/user';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';
import * as userActionHelpers from '../../../../actions/user';

const schema = {
  'type': 'object',
  'required': ['username', 'email', 'firstName', 'lastName'],
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
      'title': 'Enter Password',
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
    'classNames': 'hide-password',
    'ui:widget': PasswordWidget,
    'ui:placeholder': ' ',
    'ui:description': 'Please confirm your password to update your email address:',
  },
};

// Clone of schema with password displayed.
const schemaPass = _cloneDeep(schema);
schemaPass.required = ['username', 'email', 'password'];

// Clone of uiSchema with password displayed.
const uiSchemaPass = _cloneDeep(uiSchema);
uiSchemaPass.password.classNames = 'display-password';


class UserEditForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    const { user } = this.props;

    this.state = {
      isSending: false,
      isChanged: false,
      passwordRequired: false,
      user,
      formData: {
        username: user.name,
        email: user.mail,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      formKey: 0,
    };

    this.submitForm = this.submitForm.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange({ formData }) {
    const { user } = this.state;

    // Set isChanged flag based on user input to enable/disable Save button.
    let isChanged = false;

    // Set passwordRequired flag based on email field input.
    let passwordRequired = false;

    if (formData.username !== user.name) {
      isChanged = true;
    }

    if (formData.firstName !== user.firstName) {
      isChanged = true;
    }

    if (formData.lastName !== user.lastName) {
      isChanged = true;
    }

    if (formData.email !== user.mail) {
      isChanged = true;
      passwordRequired = true;
    }

    this.setState({ isChanged, passwordRequired, formData });
  }

  async submitForm({ formData }) {
    this.setState({
      isSending: true,
      formData,
    });

    // Lock logout until update operation is safely completed.
    const lockId = lock.add('user-update');

    try {
      // Get superagent request with authentication.
      const { request } = await this.context.auth.getRequest();
      const { user } = this.state;

      await userApi.update(request, user.uuid, {
        name: formData.username,
        mail: formData.email,
        field_first_name: formData.firstName,
        field_last_name: formData.lastName,
        pass: {
          // TODO: bug or feature?
          // To update user name ANY non-empty password can be sent.
          // To update email only valid current password should be sent.
          existing: formData.password || 'anypass',
        },
      });

      // Re-login required if user data has changed.
      await this.context.auth.refreshAuthenticationToken();

      // Reset state after successful submit.
      this.setState({
        isSending: false,
        isChanged: false,
        passwordRequired: false,
        user: {
          ...user,
          name: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          mail: formData.email,
        },
        formData: {
          ...formData,
          password: '',
        },
        // HACK: change React key after successful submit to "re-mount" component.
        // Can be removed when https://github.com/mozilla-services/react-jsonschema-form/pull/177 is released.
        formKey: this.state.formKey + 1,
      });

      // Update user data in application store.
      this.props.dispatch(userActionHelpers.updateInStore({
        name: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mail: formData.email,
      }));

      Alert.success('Your profile has been successfully updated.');
    } catch (error) {
      this.setState({ isSending: false });
      Alert.error('We could not update your profile. Please, make sure current password is correct and try again.');
    }

    lock.release(lockId);
  }

  render() {
    return (
      <Form
        key={this.state.formKey}
        schema={this.state.passwordRequired ? schemaPass : schema}
        uiSchema={this.state.passwordRequired ? uiSchemaPass : uiSchema}
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
            disabled={!this.state.isChanged}
          >
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

UserEditForm.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
    refreshAuthenticationToken: PropTypes.func,
  }),
};

UserEditForm.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  dispatch: PropTypes.func.isRequired,
};

UserEditForm.defaultProps = {
  user: {},
};

export default connect()(UserEditForm);
