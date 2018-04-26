import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import Button from '../../../atoms/Button';
import * as lessonCommentsActions from '../../../../actions/lessonComments';

class AddCommentForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
  }

  submitForm() {
    const text = this.textarea.value;
    this.props.dispatch(lessonCommentsActions.addComment(text));
    this.textarea.value = '';
  }

  render() {
    return (
      <div className="new-comment-form">
        <TextareaAutosize
          rows={3}
          innerRef={ref => this.textarea = ref}
          onChange={this.handleChange}
          placeholder="Start the conversation"
          // value={typeof data === 'string' ? data : ''}
        />
        <Button block onClick={this.submitForm}>
          Add Comment
        </Button>
      </div>
    );
  }
}

AddCommentForm.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

AddCommentForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(AddCommentForm);
