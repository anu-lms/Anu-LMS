import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown, { MenuItem, MenuIcon } from '../../../atoms/DropdownMenu';

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
  comment: PropTypes.object.isRequired,
  currentUserId: PropTypes.number.isRequired,
};

const mapStateToProps = ({ user }) => ({
  currentUserId: user.uid,
});

export default connect(mapStateToProps)(CommentMenu);
