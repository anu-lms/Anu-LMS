import React  from 'react';
import PropTypes from 'prop-types';
import Slider  from 'rc-slider';
import Paragraphs from '../index';

class LinearScale extends React.Component {

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

  handleChange(value) {
    if (this.props.handleQuizChange) {
      this.props.handleQuizChange(this.props.id, value);
    }
  }

  render() {
    const { title, from, to, blocks, data, columnClasses } = this.props;

    // The value to use should be either the value from the redux store
    // or the middle of the scale.
    const value = data ? parseInt(data) : Math.round(to.first / 2);

    return (
      <div className="container quiz linear-scale">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              <Paragraphs {...this.props} />
            </div>
            }

            <Slider
              min={from.first}
              max={to.first}
              defaultValue={value}
              value={value}
              onChange={this.handleChange}
            />

            <div className="labels">
              <div className="from">{from.second}</div>
              <div className="to">{to.second}</div>
            </div>

            <div className="current-value">
              {value}
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
  data: PropTypes.oneOfType([
    PropTypes.object, // if empty - null is given here.
    PropTypes.string, // if there's a value from the backend.
    PropTypes.number, // if there's a value from the redux store.
  ]),
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
  data: null,
};

export default LinearScale;
