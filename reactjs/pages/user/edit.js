import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withAuth from '../../auth/withAuth';
import withRedux from '../../store/withRedux';
import * as dataProcessors from '../../utils/dataProcessors';
import UserEditForm from '../../components/moleculas/Form/User';
import SiteTemplate from '../../components/organisms/Templates/SiteTemplate';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';

class UserEditPage extends Component {
  static async getInitialProps({ request }) {
    // Fetch current user using custom endpoint.
    try {
      // @todo: replace with userApi.fetchCurrent().
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
