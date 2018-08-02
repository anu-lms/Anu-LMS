import React from 'react';
import processString from 'react-process-string';

const CommentBodyWithMentions = ({ text }) => {
  const match = /<span class=\"tagged-user\" data-fullname=\"([^<>]*)\" data-avatar=\"([^<>]*)\">([^<>]+)<\/span>/g;
  let config = [{
    regex: match,
    fn: (key, result) => {
      console.log('result', result);
      return (
        <span key={key}>
          {result[1]} {result[2]} {result[3]}
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
