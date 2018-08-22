import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as userApi from '../../api/user';
import withAuth from '../../auth/withAuth';
import withRedux from '../../store/withRedux';
import withSentry from '../../application/withSentry';
import withSocket from '../../application/withSocket';
import NotificationSettingsForm from '../../components/moleculas/Form/NotificationSettings';
import SiteTemplate from '../../components/organisms/Templates/SiteTemplate';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';

class UserNotificationSettingsPage extends Component {
  static async getInitialProps({ request }) {
    const currentUser = await userApi
      .fetchCurrent(request)
      .catch(error => {
        console.error('Could not fetch current user on notification settings page.', error);
        return { user: {} };
      });

    return {
      user: currentUser,
    };
  }

  render() {
    return (
      <SiteTemplate>
        <OneColumnLayout pageTitle="Email Notification Settings">
          <NotificationSettingsForm user={this.props.user} />
        </OneColumnLayout>
      </SiteTemplate>
    );
  }
}

UserNotificationSettingsPage.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withSentry(withSocket(withRedux(withAuth(UserNotificationSettingsPage))));
