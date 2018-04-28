import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown, { MenuItem, MenuIcon } from '../../../atoms/DropdownMenu';
import * as lessonCommentsActions from '../../../../actions/lessonComments';

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
  }

  onDelete() {

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
              <Fragment>
                <MenuItem onSelect={this.onEdit}>
                  Edit Comment
                </MenuItem>

                <MenuItem className="delete" onSelect={this.onDelete} >
                  Delete Comment
                </MenuItem>
              </Fragment>
            }
          </Dropdown.Menu>
        </Dropdown.MenuWrapper>
      </Dropdown>
    );
  }
}

CommentMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  currentUserId: PropTypes.number.isRequired,
};

const mapStateToProps = ({ user }) => ({
  currentUserId: user.uid,
});

export default connect(mapStateToProps)(CommentMenu);
