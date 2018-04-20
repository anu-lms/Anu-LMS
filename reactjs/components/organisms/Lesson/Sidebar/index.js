import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as lessonSidebarActions from '../../../../actions/lessonSidebar';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.closeSidebar = this.closeSidebar.bind(this);
  }

  /**
   * Perform actions on closing the sidebar pane.
   */
  closeSidebar() {
    // Let the application now that the notebook is being closed.
    this.props.dispatch(lessonSidebarActions.close());
  }

  render() {
    const { isCollapsed, activeTabId } = this.props;

    return (
      <div className={`lesson-sidebar-container ${isCollapsed ? 'closed' : 'opened'}`}>

        <div className="lesson-sidebar">

          <div className="header">
            <div className="close" onClick={this.closeSidebar} onKeyPress={this.closeSidebar}>
              X
            </div>
            <div className={`tab notes ${activeTabId === 'notes' ? 'active' : ''}`}>
              Notes
            </div>
            <div className={`tab comments ${activeTabId === 'comments' ? 'active' : ''}`}>
              Conversation
            </div>
          </div>

          <div className="content">
            {activeTabId === 'notes' ? (
              <div>Notes content</div>
            ) : (
              <div>Conversation content</div>
            )}
          </div>
        </div>

      </div>
    );
  }
}

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  activeTabId: PropTypes.oneOf(['notes', 'comments']),
  context: PropTypes.object,
};

Sidebar.defaultProps = {
  activeTabId: 'notes',
  context: {},
};

const mapStateToProps = ({ lessonSidebar }) => ({
  isCollapsed: lessonSidebar.isCollapsed,
});

export default connect(mapStateToProps)(Sidebar);
