import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import Button from '../../../atoms/Button';
import * as lessonCommentsActions from '../../../../actions/lessonComments';

class CommentForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      text: this.props.initialText ? this.props.initialText : '',
    };

    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Clean up comment form when processing finished.
    if (this.props.isProcessing && !nextProps.isProcessing) {
      this.setState({
        text: '',
      });
    }
  }

  submitForm() {
    const text = this.textarea.value;
    if (this.props.edit) {
      // Invoke action to update a comment.
      this.props.dispatch(lessonCommentsActions.updateComment(this.props.edit, text));
    }
    else {
      // Invoke action to add a new comment.
      this.props.dispatch(lessonCommentsActions.addComment(text, this.props.replyTo));
    }
  }

  handleChange() {
    this.setState({
      text: this.textarea.value,
    });
  }

  handleKeyDown(e) {
    // Submit form on CTRL/CMD + ENTER.
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.submitForm();
    }
  }

  render() {
    const { comments, isProcessing, className, placeholder, id } = this.props;
    const { text } = this.state;

    // Prepare placeholder for the textarea.
    let inputPlaceholder = placeholder;
    if (!inputPlaceholder) {
      inputPlaceholder = comments.length > 0 ? 'Join the conversation' : 'Start the conversation';
    }

    return (
      <div className={`new-comment-form ${className}`} id={id}>
        <TextareaAutosize
          rows={3}
          innerRef={ref => this.textarea = ref}
          onChange={this.handleChange}
          placeholder={inputPlaceholder}
          onKeyDown={this.handleKeyDown}
          value={text}
        />
        <Button
          block
          loading={text.length !== 0 && isProcessing}
          onClick={this.submitForm}
          disabled={text.length === 0}
        >
          {this.props.initialText ? 'Save Comment' : 'Add Comment'}
        </Button>
      </div>
    );
  }
}

CommentForm.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

CommentForm.propTypes = {
  id: PropTypes.string,
  initialText: PropTypes.string,
  replyTo: PropTypes.number,
  edit: PropTypes.number,
  isProcessing: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

CommentForm.defaultProps = {
  id: 'new-comment-form',
  initialText: '',
  className: '',
  placeholder: null,
  replyTo: null,
  edit: null,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  comments: lessonSidebar.comments.comments,
  isProcessing: lessonSidebar.comments.form.isProcessing,
  replyTo: lessonSidebar.comments.form.replyTo,
  edit: lessonSidebar.comments.form.edit,
});

export default connect(mapStateToProps)(CommentForm);
