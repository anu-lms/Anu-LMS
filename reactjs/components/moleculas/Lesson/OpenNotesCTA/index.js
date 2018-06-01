import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddNoteCTA from '../../../atoms/CTA/AddNote';
import * as lessonSidebarActions from '../../../../actions/lessonSidebar';
import * as mediaBreakpoint from '../../../../utils/breakpoints';
import * as navigationActions from '../../../../actions/navigation';

class OpenNotesCTA extends React.Component {
  constructor(props) {
    super(props);
    this.openNotebook = this.openNotebook.bind(this);
  }

  /**
   * Performs actions when notebook pane is being opened.
   */
  async openNotebook() {
    const { dispatch } = this.props;

    // Let the application now that the notebook pane is being opened with new note form.
    dispatch(lessonSidebarActions.open('notes', 'add_new_note'));

    // If notebook is opened, close navigation pane on all devices except extra
    // large.
    if (mediaBreakpoint.isDown('xxl')) {
      dispatch(navigationActions.close());
    }
  }

  render() {
    return (
      <AddNoteCTA onClick={this.openNotebook} />
    );
  }
}

OpenNotesCTA.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(OpenNotesCTA);
