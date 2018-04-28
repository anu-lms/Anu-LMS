import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown, { ImportantMenuItem, MenuIcon } from '../../../atoms/DropdownMenu';

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
            <ImportantMenuItem onSelect={() => { this.onCopyLink(); }} >
              Copy link to comment
            </ImportantMenuItem>
            <ImportantMenuItem onSelect={() => { this.onEdit(); }} >
              Edit Comment
            </ImportantMenuItem>
            <ImportantMenuItem onSelect={() => { this.onDelete(); }} >
              Delete Comment
            </ImportantMenuItem>
          </Dropdown.Menu>
        </Dropdown.MenuWrapper>
      </Dropdown>
    );
  }
}

export default connect()(CommentMenu);
