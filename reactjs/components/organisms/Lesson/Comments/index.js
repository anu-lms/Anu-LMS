import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../../../atoms/Button';

// eslint-disable-next-line react/prefer-stateless-function
class lessonComments extends React.Component {
  render() {
    const { activeParagraphId } = this.props;

    return (
      <div className="lesson-comments-container">
        <div className="comments-header">
          <div className="title">All Comments</div>
          <div className="actions">
            <div className="add-new-comment">+ New Comment</div>
          </div>
        </div>

        <div className="comments-content">

          <div className="empty-text">
            There are no comments yet (pid {activeParagraphId}).
            <br /><br />
            <strong>Want to say something and get the conversation started?</strong>
            <br /><br />
          </div>

          <textarea placeholder="Start the conversation" />
          <Button block>
            Add Comment
          </Button>

        </div>
      </div>
    );
  }
}

lessonComments.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeParagraphId: PropTypes.number,
};

lessonComments.defaultProps = {
  activeParagraphId: 0,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  activeParagraphId: lessonSidebar.comments.paragraphId,
});

export default connect(mapStateToProps)(lessonComments);
