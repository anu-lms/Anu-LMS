import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import Button from '../../../atoms/Button';
import * as lessonCommentsActions from '../../../../actions/lessonComments';
import * as lessonCommentsHelper from '../../../../helpers/lessonComments';

class AddCommentForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      text: this.props.initialText ? this.props.initialText : '',
    };

    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isProcessing && !nextProps.isProcessing) {
      this.setState({
        text: '',
      });
    }
  }

  submitForm() {
    const text = this.textarea.value;
    this.props.dispatch(lessonCommentsActions.addComment(text));
  }

  handleChange() {
    this.setState({
      text: this.textarea.value,
    });
  }

  render() {
    const { comments, isProcessing } = this.props;
    const { text } = this.state;

    return (
      <div className="new-comment-form">
        <TextareaAutosize
          rows={3}
          innerRef={ref => this.textarea = ref}
          onChange={this.handleChange}
          placeholder={comments.length > 0 ? 'Join the conversation' : 'Start the conversation'}
          value={text}
        />
        <Button
          block
          onClick={this.submitForm}
          disabled={text.length === 0}
        >
          {this.props.initialText ? 'Save Comment' : 'Add Comment'}
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
  initialText: PropTypes.string,
  isProcessing: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

AddCommentForm.defaultProps = {
  initialText: '',
};

const mapStateToProps = ({ lessonSidebar }) => ({
  comments: lessonCommentsHelper.getOrderedComments(lessonSidebar.comments.comments),
  isProcessing: lessonSidebar.comments.form.isProcessing,
});

export default connect(mapStateToProps)(AddCommentForm);
