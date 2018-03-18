import React  from 'react';
import PropTypes from 'prop-types';
import Slider  from 'rc-slider';
import Paragraphs from '../index';

class LinearScale extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: Math.round(props.to.first / 2),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAfterChange = this.handleAfterChange.bind(this);
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

  handleChange(value) {
    this.setState({ value });
  }

  handleAfterChange(value) {
    if (this.props.handleQuizChange) {
      this.props.handleQuizChange(this.props.id, value);
    }
  }

  render() {
    const { title, from, to, blocks, handleParagraphLoaded, columnClasses } = this.props;
    return (
      <div className="container quiz linear-scale">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              <Paragraphs blocks={blocks} handleParagraphLoaded={handleParagraphLoaded} />
            </div>
            }

            <Slider
              min={from.first}
              max={to.first}
              defaultValue={Math.round(to.first / 2)}
              onChange={this.handleChange}
              onAfterChange={this.handleAfterChange}
            />

            <div className="labels">
              <div className="from">{from.second}</div>
              <div className="to">{to.second}</div>
            </div>

            <div className="current-value">
              {this.state.value}
            </div>

          </div>
        </div>
      </div>
    );
  };
}

LinearScale.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  from: PropTypes.shape({
    first: PropTypes.number,
    second: PropTypes.string,
  }).isRequired,
  to: PropTypes.shape({
    first: PropTypes.number,
    second: PropTypes.string,
  }).isRequired,
  columnClasses: PropTypes.array,
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
  handleQuizChange: PropTypes.func,
  handleParagraphLoaded: PropTypes.func,
};

LinearScale.defaultProps = {
  blocks: [],
};

export default LinearScale;
