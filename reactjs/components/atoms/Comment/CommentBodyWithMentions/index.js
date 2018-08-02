import React from 'react';
import processString from 'react-process-string';

const CommentBodyWithMentions = ({ text }) => {
  const match = /<span class=\'tagged-user\'>@([^<>]*)<\/span>/g;
  let config = [{
    regex: match,
    fn: (key, result) => {
      console.log('result', result);
      return (
        <span key={key} className="tagged-user" data-tip={result[1]}>
          {result[1]}
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
