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
    let { id, label } = this.props;

    // Checkbox can either use internal checked state or can be
    // managed from parent component. In case of latter, the prop value
    // of checked state takes preference over the internal checked state.
    let { isChecked } = this.state;
    if (this.props.isChecked !== null) {
      isChecked = this.props.isChecked; // eslint-disable-line prefer-destructuring
    }

    return (
      <div className="checkbox">
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          value={isChecked + 0}
          onChange={() => {}}
        />
        <span onClick={this.toggleCheck} onKeyPress={this.toggleCheck}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M5.403 10.58l-4.03-4.17L0 7.82l5.403 5.59L17 1.41 15.637 0z" />
            </g>
          </svg>
        </span>
        {
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, max-len
        }<label onClick={this.toggleCheck} onKeyPress={this.toggleCheck} htmlFor={id}>{label}</label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  onChange: PropTypes.func,
  isChecked: PropTypes.oneOfType([
    PropTypes.bool, // In case of state management from parent component.
    PropTypes.object, // In case of null.
  ]),
};

Checkbox.defaultProps = {
  id: '',
  isChecked: null,
  onChange: () => {},
};

export default Checkbox;
