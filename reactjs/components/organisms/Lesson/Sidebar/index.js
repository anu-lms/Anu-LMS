import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LessonNotebookOpenCTA from '../../../atoms/LessonNotebookOpenCTA';
import * as mediaBreakpoint from '../../../../utils/breakpoints';
import * as navigationActions from '../../../../actions/navigation';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
  }

  /**
   * Performs actions when sidebar is being opened.
   */
  async openSidebar() {
    const { dispatch } = this.props;

    // Let the application now that the notebook is being opened.
    dispatch(lessonNotebookActions.open());

    // If sidebar is opened, close navigation pane on all devices except extra
    // large.
    if (mediaBreakpoint.isDown('xxl')) {
      dispatch(navigationActions.close());
    }
  }

  /**
   * Perform actions on closing the sidebar pane.
   */
  closeSidebar() {
    // Close the sidebar pane.
    this.props.dispatch(lessonNotebookActions.close());
  }

  render() {
    const { isCollapsed } = this.props;

    return (
      <div className={`lesson-sidebar ${isCollapsed ? 'closed' : 'opened'}`}>

        {isCollapsed &&
          <LessonNotebookOpenCTA onClick={this.openSidebar} />
        }

        <div className="lesson-sidebar-content">
          {!isCollapsed &&
          <Fragment>

            <div className="save-close" onClick={() => this.closeSidebar()} onKeyPress={() => this.closeSidebar()}>
              Close
            </div>

            Some text
          </Fragment>
          }
        </div>

      </div>
    );
  }
}

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

Sidebar.defaultProps = {

};

Sidebar.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

const mapStateToProps = ({ lessonNotebook }) => ({
  isCollapsed: lessonNotebook.isCollapsed,
});

export default connect(mapStateToProps)(Sidebar);
