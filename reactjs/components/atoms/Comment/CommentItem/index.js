import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
// import AddCommentForm from '../AddCommentForm';
import * as userHelper from '../../../../helpers/user';
import * as lessonCommentsActions from '../../../../actions/lessonComments';

const Comment = ({ comment, dispatch }) => (
  <div className={`comment ${comment.parent ? 'nested' : ''}`}>

    <div className="comment-header">
      <div className="avatar" style={{ background: userHelper.getUserColor(comment.author) }}>
        {userHelper.getInitials(comment.author)}
      </div>
      <div className="right">

        <div className="username">
          {userHelper.getUsername(comment.author)}
          {comment.parent &&
          <span className="replied-to">
            &nbsp;&gt;&nbsp;{userHelper.getUsername(comment.parent.author)}
          </span>
          }
        </div>

        <div className="date">
          <Moment parse="unix" format="MMM Do, YYYY">{comment.created * 1000}</Moment>
        </div>

      </div>
    </div>

    <div className="comment-body">
      {comment.text}
      {/* <AddCommentForm initialText={comment.text} /> */}
    </div>

    <div className="comment-footer">
      <div className="links">

        <span
          className="link reply"
          onClick={() => {
            dispatch(lessonCommentsActions.showReplyForm(comment.id));
            lessonCommentsHelper.scrollToAddCommentForm('reply-comment-form');
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="11"
            viewBox="0 0 12 11"
          >
            <g fill="none" fillRule="evenodd">
              <path
                fill="#4A4A4A"
                fillRule="nonzero"
                d="M4.667 3V.333L0 5l4.667 4.667V6.933C8 6.933 10.333 8 12 10.333 11.333 7 9.333 3.667 4.667 3z"
              />
            </g>
          </svg>
          <span className="label">reply</span>
        </span>

      </div>
    </div>

  </div>
);

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    parentId: PropTypes.number,
    parent: PropTypes.shape({
      id: PropTypes.number,
      author: PropTypes.object,
    }),
    changed: PropTypes.number.isRequired,
    created: PropTypes.number.isRequired,
    text: PropTypes.string,
    uuid: PropTypes.string.isRequired,
    author: PropTypes.shape({
      uid: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Comment);
