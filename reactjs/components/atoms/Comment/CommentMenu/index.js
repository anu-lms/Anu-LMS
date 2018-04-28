import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown, { MenuItem, MenuIcon } from '../../../atoms/DropdownMenu';

class CommentMenu extends Component {
  onCopyLink() {

  }

  onEdit() {

  }

  onDelete() {

  }

  render() {
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
            <MenuItem onSelect={() => { this.onCopyLink(); }} >
              Copy link to comment
            </MenuItem>
            <MenuItem onSelect={() => { this.onEdit(); }} >
              Edit Comment
            </MenuItem>
            <MenuItem className="delete" onSelect={() => { this.onDelete(); }} >
              Delete Comment
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown.MenuWrapper>
      </Dropdown>
    );
  }
}

export default connect()(CommentMenu);
