import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Notebook from '../Notebook';
import * as lessonSidebarActions from '../../../../actions/lessonSidebar';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(tabName) {
    // Let the application now that the notebook is being opened.
    this.props.dispatch(lessonSidebarActions.open(tabName));
  }

  /**
   * Perform actions on closing the sidebar pane.
   */
  closeSidebar() {
    // Let the application now that the notebook is being closed.
    this.props.dispatch(lessonSidebarActions.close());
  }

  render() {
    const { isCollapsed, activeTab, activeParagraphId } = this.props;

    return (
      <div className={`lesson-sidebar-container ${isCollapsed ? 'closed' : 'opened'}`}>

        <div className="lesson-sidebar">

          <div className="header">
            <div className="close" onClick={this.closeSidebar} onKeyPress={this.closeSidebar}>
              X
            </div>
            <div
              className={`tab notes ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => {this.onTabClick('notes')}}
            >
              Notes
            </div>
            {activeParagraphId > 0 &&
              <div
                className={`tab comments ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => {
                  this.onTabClick('comments')
                }}
              >
                Conversation
              </div>
            }
          </div>

          <div className="content">
            {activeTab === 'notes' ? (
              <Notebook />
            ) : (
              <div>Conversation content {activeParagraphId}</div>
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
  activeParagraphId: PropTypes.number,
};

Sidebar.defaultProps = {
  activeTab: 'notes',
  activeParagraphId: 0,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  isCollapsed: lessonSidebar.sidebar.isCollapsed,
  activeTab: lessonSidebar.sidebar.activeTab,
  activeParagraphId: lessonSidebar.comments.paragraphId,
});

export default connect(mapStateToProps)(Sidebar);
