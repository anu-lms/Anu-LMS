import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Notebook from '../Notebook';
import Comments from '../Comments';
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

        <div className="header">
          <div className="back-to-lesson" onClick={this.closeSidebar} onKeyPress={this.closeSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <g fill="none" fillRule="evenodd">
                <path d="M-4-4h24v24H-4z" />
                <path fill="#FFF" fillRule="nonzero" d="M16 7H3.83l5.59-5.59L8 0 0 8l8 8 1.41-1.41L3.83 9H16z" />
              </g>
            </svg>
            Back to lesson
          </div>
        </div>

        <div className={`lesson-sidebar active-tab-${activeTab}`}>

          <div className="tabs">
            <div className="close" onClick={this.closeSidebar} onKeyPress={this.closeSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                <g fill="none" fillRule="evenodd">
                  <path fill="#3E3E3E" fillRule="nonzero" d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"/>
                </g>
              </svg>
            </div>

            <div
              className={`tab notes ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => { this.onTabClick('notes'); }}
              onKeyPress={() => { this.onTabClick('notes'); }}
            >
              Notes
            </div>

            {activeParagraphId > 0 &&
              <div
                className={`tab comments ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => { this.onTabClick('comments'); }}
                onKeyPress={() => { this.onTabClick('comments'); }}
              >
                Conversation
              </div>
            }
          </div>

          <div className="content">
            {activeTab === 'notes' ? (
              <Notebook />
            ) : (
              <Comments />
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
