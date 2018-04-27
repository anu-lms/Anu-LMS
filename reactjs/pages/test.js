import React from 'react';
import PropTypes from 'prop-types';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import Header from '../components/organisms/Header';
import * as dataProcessors from '../utils/dataProcessors';
import Comment from '../components/atoms/Comment';

class TestPage extends React.Component {
  static async getInitialProps({ request }) {
    // Make a request to get list of comments.
    const responseComments = await request
      .get('/jsonapi/paragraph_comment/paragraph_comment')
      .query({
        'include': 'uid, field_comment_parent',
      });

    // Normalize Comments.
    const comments = dataProcessors.processCommentsList(responseComments.body.data);

    return { comments };
  }

  render() {
    const { comments } = this.props;
    return (
      <App>
        <Header />
        <div className="page-with-header">
          <div className="comments-list">
            {comments.map(rootComment => ([
              <Comment comment={rootComment} key={rootComment.id} />,
            ]))}
          </div>
        </div>
      </App>
    );
  }
}

TestPage.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
};

TestPage.defaultProps = {
  comments: [],
};

export default withRedux(withAuth(TestPage));
