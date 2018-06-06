import React from 'react';
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
    const {
      title, blocks, columnClasses, data, id
    } = this.props;
    return (
      <div id={`paragraph-${id}`} className="container quiz textarea">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              <Paragraphs commentsAllowed={false} {...this.props} />
            </div>
            }

            <TextareaAutosize
              rows={3}
              innerRef={ref => this.textarea = ref}
              onChange={this.handleChange}
              placeholder="Type your response..."
              value={typeof data === 'string' ? data : ''}
            />
          </div>
        </div>
      </div>
    );
  }
}

FreeAnswer.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object, // if empty - null is given here.
    PropTypes.string, // if there's a value.
  ]),
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
  handleQuizChange: PropTypes.func,
  handleParagraphLoaded: PropTypes.func,
  commentsAllowed: PropTypes.bool,
};

FreeAnswer.defaultProps = {
  data: null,
  columnClasses: [],
  commentsAllowed: false,
  handleParagraphLoaded: () => {},
  handleQuizChange: () => {},
  blocks: [],
};

export default FreeAnswer;
