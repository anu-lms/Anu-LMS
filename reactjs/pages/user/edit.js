import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as dataProcessors from '../../utils/dataProcessors';
import withAuth from '../../auth/withAuth';
import SiteTemplate from '../../components/organisms/Templates/SiteTemplate';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';
import UserEditForm from '../../components/moleculas/Form/User';
import withRedux from '../../store/withRedux';

class UserEditPage extends Component {
  static async getInitialProps({ request }) {
    // Fetch current user using custom endpoint.
    try {
      const response = await request.get('/user/me?_format=json');

      return {
        user: dataProcessors.userData(response.body),
      };
    } catch (error) {
      console.log(error);
      return {
        user: {},
      };
    }
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

export default withRedux(withAuth(UserEditPage));
