import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown, { MenuItem, MenuIcon } from '../../../atoms/DropdownMenu';
import * as lessonCommentsActions from '../../../../actions/lessonComments';
import * as lessonCommentsHelper from '../../../../helpers/lessonComments';

class CommentMenu extends Component {
  constructor(props, context) {
    super(props, context);

    this.onCopyLink = this.onCopyLink.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onCopyLink() {

  }

  onEdit() {
    const { dispatch, comment } = this.props;

    // Let the store know that Comment Edit form should be shown.
    dispatch(lessonCommentsActions.showEditForm(comment.id));

    // Set focus on the form.
    setTimeout(() => {
      const editCommentForm = document.getElementById('edit-comment-form');
      editCommentForm.getElementsByTagName('textarea')[0].focus({ preventScroll: true });
    }, 50);
  }

  onDelete() {
    const { dispatch, comments, comment } = this.props;

    // Mark Comments as deleted if it has children comments or delete at all otherwise.
    if (lessonCommentsHelper.hasChildrenComments(comments, comment.id)) {
      dispatch(lessonCommentsActions.markCommentAsDeleted(comment.id));
    }
    else {
      dispatch(lessonCommentsActions.deleteComment(comment.id));
    }
  }

  render() {
    const { comment, currentUserId } = this.props;
    return (
      <Dropdown>
        <Dropdown.Toggle
          noCaret
          btnStyle="link"
        >
          <MenuIcon />
        </Dropdown.Toggle>
        <Dropdown.MenuWrapper pullRight>
          <Dropdown.Menu pullRight>
            <MenuItem onSelect={this.onCopyLink} >
              Copy link to comment
            </MenuItem>
            {comment.author.uid === currentUserId &&
              <MenuItem onSelect={this.onEdit}>
                Edit Comment
              </MenuItem>
            }
            {comment.author.uid === currentUserId &&
              <MenuItem className="delete" onSelect={this.onDelete} >
                Delete Comment
              </MenuItem>
            }
          </Dropdown.Menu>
        </Dropdown.MenuWrapper>
      </Dropdown>
    );
  }
}

CommentMenu.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  currentUserId: PropTypes.number.isRequired,
};

const mapStateToProps = ({ user, lessonSidebar }) => ({
  currentUserId: user.uid,
  comments: lessonSidebar.comments.comments,
});

export default connect(mapStateToProps)(CommentMenu);
