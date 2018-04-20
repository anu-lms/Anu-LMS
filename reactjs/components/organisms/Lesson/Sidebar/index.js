import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';

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
    this.props.dispatch(lessonNotebookActions.close());
  }

  render() {
    const { isCollapsed } = this.props;

    return (
      <div className={`lesson-sidebar ${isCollapsed ? 'closed' : 'opened'}`}>

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

const mapStateToProps = ({ lessonNotebook }) => ({
  isCollapsed: lessonNotebook.isCollapsed,
});

export default connect(mapStateToProps)(Sidebar);
