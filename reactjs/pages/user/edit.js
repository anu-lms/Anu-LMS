import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as userApi from '../../api/user';
import withAuth from '../../auth/withAuth';
import withRedux from '../../store/withRedux';
import withSentry from '../../application/withSentry';
import UserEditForm from '../../components/moleculas/Form/User';
import SiteTemplate from '../../components/organisms/Templates/SiteTemplate';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';

class UserEditPage extends Component {
  static async getInitialProps({ request }) {
    const currentUser = await userApi
      .fetchCurrent(request)
      .catch(error => {
        console.error('Could not fetch current user on user edit page.', error);
        return { user: {} };
      });

    return {
      user: currentUser,
    };
  }

  render() {
    return (
      <SiteTemplate>
        <OneColumnLayout pageTitle="Edit Profile" className="short">
          <UserEditForm user={this.props.user} />
        </OneColumnLayout>
      </SiteTemplate>
    );
  }
}

UserEditPage.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withSentry(withRedux(withAuth(UserEditPage)));
