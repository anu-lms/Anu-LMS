import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    const amount = paragraphId === activeParagraphId ? commentsAmount : 0;
    return (
      <CommentsCTA
        onClick={this.toggleCommentsPanel}
        active={paragraphId === activeParagraphId}
        amount={amount}
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

const mapStateToProps = ({ lessonSidebar, user, lesson }) =>

  // const commentsAmount =

  ({
    activeParagraphId: lessonSidebar.comments.paragraphId,
    commentsAmount: 3,
  });
export default connect(mapStateToProps)(ShowCommentsCTA);
