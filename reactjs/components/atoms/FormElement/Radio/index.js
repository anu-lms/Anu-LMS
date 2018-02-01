import React from 'react';
import PropTypes from 'prop-types';

class Radio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
    };

    this.handleAddSelection = this.handleAddSelection.bind(this);
    this.handleRemoveSelection = this.handleRemoveSelection.bind(this);
  }

  handleAddSelection() {

    this.setState({ isChecked: true });

    if (this.props.onChange) {
      this.props.onChange(this.props.id, true);
    }
  }

  handleRemoveSelection() {
    this.setState({ isChecked: false });
  }

  render() {
    let { id, name, label } = this.props;

    return (
      <div className="radio">
        <input
          type="radio"
          name={name}
          value={id}
          onChange={this.handleRemoveSelection}
          checked={this.state.isChecked}
        />
        <span onClick={this.handleAddSelection} />
        <label onClick={this.handleAddSelection}>{label}</label>
      </div>
    );
  }
}

Radio.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default Radio;
