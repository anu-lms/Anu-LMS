import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import CommentEditForm from '../Form';
import { scrollToElement } from '../../../../utils/scrollTo';
import CommentMenu from '../Menu';
import * as userHelper from '../../../../helpers/user';
import * as lessonCommentsActions from '../../../../actions/lessonComments';

class Comment extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      displayBlock: false,
      date_formatted_hrs: '',
    };

    this.showReplyForm = this.showReplyForm.bind(this);
    this.onCommentClick = this.onCommentClick.bind(this);
  }

  componentDidMount() {
    // We update formatted date to make sure we set the date in the user's timezone and not in the
    // server's timezone.
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      date_formatted_hrs: moment(this.props.comment.created, 'X').format('h:mma'),
      displayBlock: true,
    });
  }

  // @todo: remove test code.
  async onCommentClick() {
    const { comment } = this.props;

    // Get superagent request with authentication.
    const { request } = await this.context.auth.getRequest();

    request
      .post('/comments/mark-as-read')
      .query({ '_format': 'json' })
      .set('Content-Type', 'application/json')
      .send({
        comment_ids: [comment.id],
      })
      .then(response => {
        console.log(response.body);
      });
  }

  showReplyForm() {
    const { comment, dispatch } = this.props;

    // Let the store know that Reply form should be shown.
    dispatch(lessonCommentsActions.showReplyForm(comment.id));

    // Scroll user to the reply form and set focus.
    scrollToElement('reply-comment-form', 'lesson-comments-scrollable', 400, () => {
      document.getElementById('reply-comment-form')
        .getElementsByTagName('textarea')[0].focus({ preventScroll: true });
    });
  }

  render() {
    const { comment, editedComment, highlightedComment } = this.props;
    const wrapperClasses = ['comment', 'fade-in-hidden']; // @todo: replace with classnames util.
    if (comment.parent) {
      wrapperClasses.push('nested');
    }
    if (highlightedComment && highlightedComment === comment.id) {
      wrapperClasses.push('highlighted');
    }
    if (this.state.displayBlock) {
      wrapperClasses.push('fade-in-shown');
    }
    // @todo: remove test class.
    if (!comment.isRead) {
      wrapperClasses.push('new');
    }

    if (comment.deleted) {
      wrapperClasses.push('deleted');
      return (
        <div className={wrapperClasses.join(' ')}>
          Comment Deleted
        </div>
      );
    }

    return (
      <div
        className={wrapperClasses.join(' ')}
        id={`comment-${comment.id}`}
        onClick={this.onCommentClick}
        onKeyPress={this.onCommentClick}
      >

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

            <div className="date" title={this.state.date_formatted_hrs}>
              <Moment parse="X" format="MMM Do, YYYY">{comment.created}</Moment>
            </div>

          </div>

          <div className="context-menu">
            <CommentMenu comment={comment} />
          </div>
        </div>

        <div className="comment-body">
          {editedComment && editedComment === comment.id ? (
            <CommentEditForm id="edit-comment-form" placeholder="Update your comment" initialText={comment.text} />
          ) : (
            comment.text.trim()
          )}
        </div>

        {(!editedComment || (editedComment && editedComment !== comment.id)) &&
        <div className="comment-footer">
          <div className="links">

            <span
              className="link reply"
              onClick={this.showReplyForm}
              onKeyPress={this.showReplyForm}
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
        }

      </div>
    );
  }
}

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
    isRead: PropTypes.bool.isRequired,
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
  editedComment: PropTypes.number,
  highlightedComment: PropTypes.number,
};

Comment.defaultProps = {
  editedComment: null,
  highlightedComment: null,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  editedComment: lessonSidebar.comments.form.editedComment,
  highlightedComment: lessonSidebar.comments.highlightedComment,
});

Comment.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

export default connect(mapStateToProps)(Comment);
