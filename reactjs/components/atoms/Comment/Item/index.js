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
  }

  componentDidMount() {
    const { highlightedComment, comment } = this.props;
    // We update formatted date to make sure we set the date in the user's timezone and not in the
    // server's timezone.
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      date_formatted_hrs: moment(this.props.comment.created, 'X').format('h:mma'),
      displayBlock: true,
    });

    // Scroll to the highlighted comment.
    if (highlightedComment && highlightedComment === comment.id) {
      scrollToElement('lesson-comments-scrollable', `comment-${highlightedComment}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    // Scroll to the highlighted comment.
    // Check here because `highlightedComment` prop is not always available in componentDidMount.
    if (!this.props.highlightedComment && nextProps.highlightedComment &&
      nextProps.highlightedComment === nextProps.comment.id) {
      scrollToElement('lesson-comments-scrollable', `comment-${nextProps.highlightedComment}`);
    }
  }

  showReplyForm() {
    const { comment, dispatch } = this.props;

    // Let the store know that Reply form should be shown.
    dispatch(lessonCommentsActions.showReplyForm(comment.id));

    // Scroll user to the reply form and set focus.
    scrollToElement('lesson-comments-scrollable', 'reply-comment-form', () => {
      document.getElementById('reply-comment-form')
        .getElementsByTagName('textarea')[0].focus({ preventScroll: true });
    });
  }

  render() {
    const { comment, editId, highlightedComment } = this.props;
    const wrapperClasses = ['comment', 'fade-in-hidden'];
    if (comment.parent) {
      wrapperClasses.push('nested');
    }
    if (highlightedComment && highlightedComment === comment.id) {
      wrapperClasses.push('highlighted');
    }
    if (this.state.displayBlock) {
      wrapperClasses.push('fade-in-shown');
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
      <div className={wrapperClasses.join(' ')} id={`comment-${comment.id}`}>

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
          {editId && editId === comment.id ? (
            <CommentEditForm id="edit-comment-form" placeholder="Update your comment" initialText={comment.text} />
          ) : (
            comment.text.trim()
          )}
        </div>

        {(!editId || (editId && editId !== comment.id)) &&
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
  editId: PropTypes.number,
  highlightedComment: PropTypes.number,
};

Comment.defaultProps = {
  editId: null,
  highlightedComment: null,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  editId: lessonSidebar.comments.form.edit,
  highlightedComment: lessonSidebar.comments.highlightedComment,
});

export default connect(mapStateToProps)(Comment);
