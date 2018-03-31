import React from 'react';
import PropTypes from 'prop-types';

class Checkbox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
    };

    this.toggleCheck = this.toggleCheck.bind(this);
  }

  toggleCheck() {
    this.setState((prevState) => {
      const newState = !prevState.isChecked;

      if (this.props.onChange) {
        this.props.onChange(this.props.id, newState);
      }

      return { isChecked: newState };
    });
  }

  render() {
    const { id, label } = this.props;

    return (
      <div className="checkbox">
        <input type="checkbox" id={id} checked={this.state.isChecked} value={this.state.isChecked + 0} />
        <span onClick={this.toggleCheck}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M5.403 10.58l-4.03-4.17L0 7.82l5.403 5.59L17 1.41 15.637 0z" />
            </g>
          </svg>
        </span>
        <label onClick={this.toggleCheck} htmlFor={id}>{label}</label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  id: '',
};

export default Checkbox;
