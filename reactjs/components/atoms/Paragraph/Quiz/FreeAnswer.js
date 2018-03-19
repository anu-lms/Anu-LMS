import React  from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';
import Paragraphs from '../index';

class FreeAnswer extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

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

  handleChange() {
    if (this.props.handleQuizChange) {
      this.props.handleQuizChange(this.props.id, this.textarea.value);
    }
  }

  render() {
    const { title, blocks, handleParagraphLoaded, columnClasses } = this.props;
    return (
      <div className="container quiz textarea">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              <Paragraphs blocks={blocks} handleParagraphLoaded={handleParagraphLoaded} />
            </div>
            }

            <TextareaAutosize
              rows={3}
              innerRef={ref => this.textarea = ref}
              onChange={this.handleChange}
              placeholder="Type your response..."
            />
          </div>
        </div>
      </div>
    );
  };
}

FreeAnswer.propTypes = {
  title: PropTypes.string,
  id: PropTypes.number,
  columnClasses: PropTypes.array,
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
  handleQuizChange: PropTypes.func,
  handleParagraphLoaded: PropTypes.func,
};

FreeAnswer.defaultProps = {
  blocks: [],
};

export default FreeAnswer;
