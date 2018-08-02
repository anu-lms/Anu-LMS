import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { MentionsInput, Mention } from 'react-mentions';
import Avatar from '../../User/Avatar';
import Button from '../../../atoms/Button';
import * as lessonCommentsActions from '../../../../actions/lessonComments';
import * as userApi from '../../../../api/user';

class CommentForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      text: this.props.initialText || '',
      showTaggedUsersAmount: 7,
    };
    this.lastTaggedQueryId = null;

    this.fetchTaggedUsers = this.fetchTaggedUsers.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTextareaFocus = this.handleTextareaFocus.bind(this);
  }

  /**
   * @todo: deprecated method.
   */
  componentWillReceiveProps(nextProps) {
    // Clean up comment form when processing finished.
    if (this.props.isProcessing && !nextProps.isProcessing) {
      this.setState({
        text: '',
      });
    }
  }

  handleTextareaFocus({ target }) {
    const { id, replyTo, editedComment, dispatch } = this.props;

    // Calculates an amount of items to show in tagged users popup.
    // To limit height and show scroll bar when it shown for first comment.
    const taggedPopupItemHeight = 40;
    const textareaTopPosition = target.getBoundingClientRect().top;
    const siteHeaderHeight = document.getElementById('site-header').offsetHeight;
    const tabsHeight = 32;
    const paddings = 10;

    const freeArea = textareaTopPosition - siteHeaderHeight - tabsHeight - paddings;
    const popupItemsAmount = Math.floor(freeArea / taggedPopupItemHeight);
    this.setState({
      showTaggedUsersAmount: popupItemsAmount,
    });

    // Hide Edit and Reply forms if user set focus on Add new comment form.
    if (id === 'new-comment-form' && (replyTo || editedComment)) {
      dispatch(lessonCommentsActions.hideForms());
    }
  }

  /**
   * Comment form submit function.
   */
  submitForm() {
    const { text } = this.state;
    const { editedComment, dispatch, replyTo } = this.props;
    if (editedComment) {
      // Invoke action to update a comment.
      dispatch(lessonCommentsActions.updateComment(editedComment, text));
    }
    else {
      // Invoke action to add a new comment.
      dispatch(lessonCommentsActions.addComment(text, replyTo));
    }
  }

  /**
   * Function to fetch tagged users from the backend.
   */
  async fetchTaggedUsers(query, callback) {
    const { activeOrganizationId } = this.props;
    const { request } = await this.context.auth.getRequest();

    if (this.lastTaggedQueryId) {
      clearTimeout(this.lastTaggedQueryId);
    }

    this.lastTaggedQueryId = setTimeout(() => {
      userApi.fetchTaggedUsers(request, query, activeOrganizationId)
        .then(res => {
          this.lastTaggedQueryId = null;
          return res.map(user => ({
            display: user.name,
            id: user.uid,
            user,
          }));
        })
        .then(callback);
    }, 350);
  }

  handleChange({ target }) {
    this.setState({
      text: target.value,
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
    const { text, showTaggedUsersAmount } = this.state;

    // Prepare placeholder for the textarea.
    let inputPlaceholder = placeholder;
    if (!inputPlaceholder) {
      inputPlaceholder = comments.length > 0 ? 'Join the conversation' : 'Start the conversation';
    }

    return (
      <div className={classNames(['comment-form', className])} id={id}>
        <MentionsInput
          className={classNames(['tagging-wrapper', `items-amount-${showTaggedUsersAmount}`])}
          value={text}
          onChange={this.handleChange}
          placeholder={inputPlaceholder}
          displayTransform={(id, display) => `@${display}`} // eslint-disable-line no-shadow
          markup='<span class="tagged-user" data-fullname="__id__" data-avatar="https://regex101.com">@__display__</span>'
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleTextareaFocus}
        >
          <Mention
            trigger="@"
            data={this.fetchTaggedUsers}
            className="tagging-highlighter-item"
            appendSpaceOnAdd
            renderSuggestion={suggestion => (
              <Fragment>
                <Avatar user={suggestion.user} />
                <span className="username">@{suggestion.user.name}</span> {suggestion.user.firstName} {suggestion.user.lastName}
              </Fragment>
            )}
          />
        </MentionsInput>
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
  editedComment: PropTypes.number,
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
  editedComment: null,
};

const mapStateToProps = ({ lessonSidebar, user }) => ({
  comments: lessonSidebar.comments.comments,
  isProcessing: lessonSidebar.comments.form.isProcessing,
  replyTo: lessonSidebar.comments.form.replyTo,
  editedComment: lessonSidebar.comments.form.editedComment,
  activeOrganizationId: user.activeOrganization,
});

export default connect(mapStateToProps)(CommentForm);
