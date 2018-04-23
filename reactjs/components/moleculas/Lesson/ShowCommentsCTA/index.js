import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CommentsCTA from '../../../atoms/CTA/CommentsCTA';
import * as lessonSidebarActions from '../../../../actions/lessonSidebar';
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
      // Let the application now that the notebook is being opened.
      dispatch(lessonSidebarActions.setActiveParagraph(paragraphId));

      // Let the application now that the notebook is being opened.
      dispatch(lessonSidebarActions.open('comments'));

      // If sidebar is opened, close navigation pane on all devices except extra
      // large.
      if (mediaBreakpoint.isDown('xxl')) {
        dispatch(navigationActions.close());
      }
    }
    else {
      // Let the application now that the notebook is being closed.
      dispatch(lessonSidebarActions.close());
    }
  }

  render() {
    const { paragraphId, activeParagraphId } = this.props;
    return (
      <CommentsCTA
        onClick={this.toggleCommentsPanel}
        active={paragraphId === activeParagraphId}
      />
    );
  }
}

ShowCommentsCTA.propTypes = {
  dispatch: PropTypes.func.isRequired,
  paragraphId: PropTypes.number.isRequired,
  activeParagraphId: PropTypes.number.isRequired,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  activeParagraphId: lessonSidebar.comments.paragraphId,
});

export default connect(mapStateToProps)(ShowCommentsCTA);
