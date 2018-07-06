import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getObjectById } from '../../../../utils/array';
import CommentsCTA from '../../../atoms/CTA/Comments';
import * as lessonSidebarActions from '../../../../actions/lessonSidebar';
import * as lessonCommentsActions from '../../../../actions/lessonComments';
import * as mediaBreakpoint from '../../../../utils/breakpoints';
import * as navigationActions from '../../../../actions/navigation';

class ShowCommentsCTA extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCommentsPanel = this.toggleCommentsPanel.bind(this);
  }

  toggleCommentsPanel() {
    const { dispatch, paragraphId, activeParagraphId } = this.props;

    if (paragraphId !== activeParagraphId) {
      // Set active paragraph.
      dispatch(lessonCommentsActions.setActiveParagraph(paragraphId));

      // Let the application now that the sidebar is being opened.
      dispatch(lessonSidebarActions.open('comments'));

      // If sidebar is opened, close navigation pane on all devices except extra
      // large.
      if (mediaBreakpoint.isDown('xxl')) {
        dispatch(navigationActions.close());
      }
    }
    else {
      // Let the application now that the sidebar is being closed.
      dispatch(lessonSidebarActions.close());
    }
  }

  render() {
    const { paragraphId, activeParagraphId, commentsAmount } = this.props;
    return (
      <CommentsCTA
        onClick={this.toggleCommentsPanel}
        active={paragraphId === activeParagraphId}
        amount={commentsAmount}
      />
    );
  }
}

ShowCommentsCTA.propTypes = {
  dispatch: PropTypes.func.isRequired,
  paragraphId: PropTypes.number.isRequired,
  activeParagraphId: PropTypes.number.isRequired,
  commentsAmount: PropTypes.number.isRequired,
};

const mapStateToProps = ({ lessonSidebar, user, lesson }, { paragraphId }) => {
  let commentsAmount = 0;
  const activeLesson = getObjectById(lesson.lessons, lesson.activeLesson);

  if (activeLesson) {
    const currentBlock = getObjectById(activeLesson.blocks, paragraphId);
    const activeOrganizationId = user.activeOrganization ? user.activeOrganization : 0;

    if (currentBlock && currentBlock.commentsAmount && currentBlock.commentsAmount[activeOrganizationId]) {
      commentsAmount = currentBlock.commentsAmount[activeOrganizationId];
    }
  }

  return {
    activeParagraphId: lessonSidebar.comments.paragraphId,
    commentsAmount,
  };
};

export default connect(mapStateToProps)(ShowCommentsCTA);
