import React from 'react';
import processString from 'react-process-string';
import _find from 'lodash/find';
import Avatar from '../../User/Avatar';
import { getUsername } from '../../../../helpers/user';

const CommentBodyWithMentions = ({ text, mentions }) => {
  const match = /<span class=\'tagged-user\'>@([^<>]*)<\/span>/g;
  let config = [{
    regex: match,
    fn: (key, result) => {
      console.log('result', result);

      const mentionedUser = _find(mentions, item => item.name === result[1]);
      return (
        <span key={key} className="tagged-user" data-tip={getUsername(mentionedUser)}>
          @{result[1]}
        </span>
      ); },
  }];
  let processed = processString(config)(text);
  console.log('processed', processed);

  return (
    processed
  );
};

export default CommentBodyWithMentions;
