import React  from 'react';
import PropTypes from 'prop-types';
import Slider  from 'rc-slider';

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
    console.log('id: ' + this.props.id);
    console.log('value: ' + value);
  }

  render() {
    const { title, from, to, labelFrom, labelTo } = this.props;
    return (
      <div className="container quiz linear-scale">
        <div className="row">
          <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
            <div className="title">{title}</div>
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
};

export default LinearScale;
