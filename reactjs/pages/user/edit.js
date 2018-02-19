import React, { Component } from 'react';
import * as dataProcessors from '../../utils/dataProcessors';
import App from '../../application/App';
import withAuth from '../../auth/withAuth';
import Header from '../../components/organisms/Header';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';
import UserEditForm from '../../components/moleculas/Form/User';

class UserEditPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header">
          <OneColumnLayout pageTitle="Edit Profile">
            <UserEditForm user={this.props.user} />
          </OneColumnLayout>
        </div>
      </App>
    );
  }

  static async getInitialProps({ request }) {
    // Fetch current user using custom endpoint.
    // TODO: follow up in https://www.drupal.org/project/jsonapi/issues/2927037#comment-12486771
    try {
      const response = await request.get('/current_user?_format=json');

      return {
        user: dataProcessors.userData(response.body)
      };
    } catch (error) {
      console.log(error);
      return {
        user: {}
      }
    }


  }
}

export default withAuth(UserEditPage);
