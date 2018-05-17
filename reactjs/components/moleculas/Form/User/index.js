import React from 'react';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import Form from '../../../atoms/Form';
import Button from '../../../atoms/Button';
import * as lock from '../../../../utils/lock';
import PasswordWidget from '../../../atoms/Form/PasswordWidget';

const schema = {
  'type': 'object',
  'required': ['username', 'email'],
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
      const { sessionToken } = this.props;

      await request
        .patch(`/jsonapi/user/user/${user.uuid}`)
        .set('X-CSRF-Token', sessionToken)
        .send({
          data: {
            type: 'user--user',
            id: user.uuid,
            attributes: {
              name: formData.username,
              mail: formData.email,
              pass: {
                // TODO: bug or feature?
                // To update user name ANY non-empty password can be sent.
                // To update email only valid current password should be sent.
                existing: formData.password ? formData.password : 'anypass',
              },
            },
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
};

UserEditForm.defaultProps = {
  user: {},
};

const mapStateToProps = ({ user }) => ({
  sessionToken: user.sessionToken,
});

export default connect(mapStateToProps)(UserEditForm);
