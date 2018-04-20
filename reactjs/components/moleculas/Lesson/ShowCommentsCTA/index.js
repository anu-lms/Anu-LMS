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
    this.showCommentsPanel = this.showCommentsPanel.bind(this);
  }

  showCommentsPanel() {
    const { dispatch } = this.props;

    // Let the application now that the notebook is being opened.
    dispatch(lessonSidebarActions.open('comments'));

    // If sidebar is opened, close navigation pane on all devices except extra
    // large.
    if (mediaBreakpoint.isDown('xxl')) {
      dispatch(navigationActions.close());
    }
  }

  render() {
    return (
      <CommentsCTA amount={this.props.paragraphId} onClick={this.showCommentsPanel} />
    );
  }
}

ShowCommentsCTA.propTypes = {
  dispatch: PropTypes.func.isRequired,
  paragraphId: PropTypes.number.isRequired,
};

ShowCommentsCTA.defaultProps = {

};

const mapStateToProps = ({ lessonSidebar }) => ({
  isCollapsed: lessonSidebar.isCollapsed,
});

export default connect(mapStateToProps)(ShowCommentsCTA);
