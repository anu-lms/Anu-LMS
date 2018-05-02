import React from 'react';
import PropTypes from 'prop-types';
import ShowCommentsCTA from '../../../moleculas/Lesson/ShowCommentsCTA';

class Text extends React.Component {
  componentDidMount() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  componentDidUpdate() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  render() {
    const { text, columnClasses, id } = this.props;
    return (
      <div className="container text">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            {
            // eslint-disable-next-line react/no-danger
            }<div dangerouslySetInnerHTML={{ __html: text.value }} />

            { // eslint-disable-next-line react/prop-types, max-len
              this.props.data === undefined && // Don't output comments icon for blocks inside quizes.
              <ShowCommentsCTA paragraphId={id} />
            }
          </div>
        </div>
      </div>
    );
  }
}

Text.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
  text: PropTypes.shape({
    value: PropTypes.string,
    format: PropTypes.string,
  }).isRequired,
};

Text.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  handleParagraphLoaded: () => {},
};

export default Text;
