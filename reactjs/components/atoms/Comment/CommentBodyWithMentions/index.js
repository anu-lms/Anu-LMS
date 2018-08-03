import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import Tooltip from 'rc-tooltip';
import processString from 'react-process-string';
import Avatar from '../../User/Avatar';
import { getUsername } from '../../../../helpers/user';

class CommentBodyWithMentions extends React.Component {
  render() {
    const { text, mentions } = this.props;
    const match = /<span class='tagged-user'>@([^<>]*)<\/span>/g;
    let config = [{
      regex: match,
      fn: (key, result) => {
        // Find mentioned user in the array.
        const mentionedUser = _find(mentions, item => item.name === result[1]);
        if (!mentionedUser) {
          return <span key={key} className="tagged-user">@{result[1]}</span>;
        }

        // Show tooltip with data about user.
        const overlay = (
          <Fragment>
            <Avatar user={mentionedUser} /> <span>{getUsername(mentionedUser)}</span>
          </Fragment>
        );
        return (
          <Tooltip
            key={key}
            placement="top"
            overlay={overlay}
            overlayClassName="tagged-user-tooltip"
            destroyTooltipOnHide
            mouseLeaveDelay={0.1}
            trigger={['hover', 'click']}
            mouseEnterDelay={0.15}
            getTooltipContainer={() => document.querySelector('.comments-content')}
            align={{ offset: [0, 4] }}
          >
            <span className="tagged-user">@{result[1]}</span>
          </Tooltip>
        );
      },
    }];
    let processed = processString(config)(text);

    return (
      processed
    );
  }
}

CommentBodyWithMentions.propTypes = {
  text: PropTypes.string,
  mentions: PropTypes.arrayOf(PropTypes.object),
};

CommentBodyWithMentions.defaultProps = {
  text: '',
  mentions: [],
};

export default CommentBodyWithMentions;
