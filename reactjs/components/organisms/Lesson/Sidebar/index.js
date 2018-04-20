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
    const { isCollapsed, activeTab } = this.props;

    return (
      <div className={`lesson-sidebar-container ${isCollapsed ? 'closed' : 'opened'}`}>

        <div className="lesson-sidebar">

          <div className="header">
            <div className="close" onClick={this.closeSidebar} onKeyPress={this.closeSidebar}>
              X
            </div>
            <div className={`tab notes ${activeTab === 'notes' ? 'active' : ''}`}>
              Notes
            </div>
            <div className={`tab comments ${activeTab === 'comments' ? 'active' : ''}`}>
              Conversation
            </div>
          </div>

          <div className="content">
            {activeTab === 'notes' ? (
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
  activeTab: PropTypes.oneOf(['notes', 'comments']),
  context: PropTypes.object,
};

Sidebar.defaultProps = {
  activeTab: 'notes',
  context: {},
};

const mapStateToProps = ({ lessonSidebar }) => ({
  isCollapsed: lessonSidebar.sidebar.isCollapsed,
  activeTab: lessonSidebar.sidebar.activeTab,
});

export default connect(mapStateToProps)(Sidebar);
