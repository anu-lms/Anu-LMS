import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LessonNotebookOpenCTA from '../../../atoms/LessonNotebookOpenCTA';
import PageLoader from '../../../atoms/PageLoader';
import * as mediaBreakpoint from '../../../../utils/breakpoints';
import * as navigationActions from '../../../../actions/navigation';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Indicates if the notebook pane is being opened.
      isNotebookOpening: false,
    };

    this.handleNotebookOpen = this.handleNotebookOpen.bind(this);
    this.handleNotebookClose = this.handleNotebookClose.bind(this);
  }

  /**
   * Performs actions when notebook pane is being opened.
   */
  async handleNotebookOpen() {
    const { dispatch } = this.props;

    // As soon as notebook icon is clicked, we change the opening state.
    // It will show a loader instead of note until note is ready to be shown.
    this.setState({ isNotebookOpening: true });

    // Let the application now that the notebook is being opened.
    dispatch(lessonNotebookActions.open());

    // If notebook is opened, close navigation pane on all devices except extra
    // large.
    if (mediaBreakpoint.isDown('xxl')) {
      dispatch(navigationActions.close());
    }

    // Dismiss notebook opening state.
    this.setState({ isNotebookOpening: false });
  }

  /**
   * Perform actions on closing the notebook pane.
   */
  handleNotebookClose() {
    // Close the notebook pane.
    this.props.dispatch(lessonNotebookActions.close());
  }

  render() {
    const { isCollapsed } = this.props;

    return (
      <div className={`collapsible-notebook lesson  ${isCollapsed ? 'closed' : 'opened'}`}>

        {isCollapsed &&
        <LessonNotebookOpenCTA handleNotebookOpen={this.handleNotebookOpen} />
        }

        <div className="lesson-notebook-wrapper">
          {!isCollapsed &&
          <div className="lesson-notebook">

            {this.state.isNotebookOpening &&
            <PageLoader />
            }
            <div className="save-close" onClick={() => this.handleNotebookClose()} onKeyPress={() => this.handleNotebookClose()}>
              Close
            </div>
          </div>
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
