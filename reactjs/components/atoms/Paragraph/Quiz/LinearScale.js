import React  from 'react';
import PropTypes from 'prop-types';
import Slider  from 'rc-slider';
import Paragraphs from '../index';

class LinearScale extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: Math.round(props.to / 2),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAfterChange = this.handleAfterChange.bind(this);
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
    const { title, from, to, labelFrom, labelTo, blocks } = this.props;
    return (
      <div className="container quiz linear-scale">
        <div className="row">
          <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              <Paragraphs blocks={blocks} />
            </div>
            }

            <Slider
              min={from}
              max={to}
              defaultValue={Math.round(to / 2)}
              onChange={this.handleChange}
              onAfterChange={this.handleAfterChange}
            />

            <div className="labels">
              <div className="from">{labelFrom}</div>
              <div className="to">{labelTo}</div>
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
  id: PropTypes.string.isRequired,
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  labelFrom: PropTypes.string.isRequired,
  labelTo: PropTypes.string.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
  handleQuizChange: PropTypes.func,
};

LinearScale.defaultProps = {
  blocks: [],
};

export default LinearScale;
