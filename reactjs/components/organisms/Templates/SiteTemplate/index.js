import React from 'react';
import PropTypes from 'prop-types';
import App from '../../../../application/App';
import Header from '../../Header';
import ErrorPage from '../../../atoms/ErrorPage';
import { connect } from 'react-redux';
import withRedux from '../../../../store/withRedux';
import * as userActionHelpers from '../../../../actions/user';
import * as dataProcessors from '../../../../utils/dataProcessors';

class SiteTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.loginParamsUpdateRequested = false;
  }

  async componentDidUpdate() {
    const { uid, sessionToken, dispatch } = this.props;

    // We introduced `uid` and `sessionToken` variables related to user login in application store.
    // Usually users update these variables on login step.
    // We should initialize these variables for users who stay logged in after deploy
    // and have no these variables yet.
    // @todo: Can be removed later. Potentially we should find better place to do it.
    if (!this.loginParamsUpdateRequested && (!uid || !sessionToken)) {
      // Get superagent request with authentication token.
      const { request } = await this.context.auth.getRequest();

      // Get currently logged in user.
      const userResponse = await request.get('/user/me?_format=json');
      const currentUser = dataProcessors.userData(userResponse.body);

      // Makes request to get session token that will be used for post requests.
      const requestedSessionToken = await request.get('/session/token');

      // Store logged in user UID in application store.
      dispatch(userActionHelpers.login(currentUser.uid, requestedSessionToken.text));

      this.loginParamsUpdateRequested = true;
    }
  }

  render() {
    const { children, statusCode, isHeaderEmpty, className } = this.props;
    return (
      <App>
        <Header isEmpty={isHeaderEmpty} />
        <div className={`page-with-header ${className}`}>
          {statusCode === 200 ? (
            children
          ) : (
            <ErrorPage code={statusCode} />
          )}
        </div>
      </App>
    );
  }
}

SiteTemplate.propTypes = {
  className: PropTypes.string,
  statusCode: PropTypes.number,
  isHeaderEmpty: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

SiteTemplate.defaultProps = {
  className: '',
  statusCode: 200,
  isHeaderEmpty: false,
};

SiteTemplate.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

const mapStateToProps = ({ user }) => ({
  uid: user.uid,
  sessionToken: user.sessionToken,
});

export default withRedux(connect(mapStateToProps)(SiteTemplate));
