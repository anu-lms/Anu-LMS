import React from 'react';
import Button from '../../../atoms/Button';

const AddCommentForm = () => (
  <div className="new-comment-form">
    <textarea placeholder="Start the conversation" />
    <Button block disabled>
      Add Comment
    </Button>
  </div>
);

export default AddCommentForm;
