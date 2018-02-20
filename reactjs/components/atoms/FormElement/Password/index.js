import React, { Component } from 'react';
import zxcvbn from 'zxcvbn';
import PropTypes from 'prop-types';

class PasswordStrength extends Component {

  constructor(props) {
    super(props);

    this.state = {
      score: 0,
      isValid: false,
      password: '',
      fieldType: 'password'
    };

    this.handleChange.bind(this);
    this.showPasswordHandler.bind(this);
    this.hidePasswordHandler.bind(this);
  }

  componentDidMount() {
    const { defaultValue } = this.props;

    if (defaultValue.length > 0) {
      this.setState({ password: defaultValue }, this.handleChange);
    }
  }

  isTooShort(password, minLength) {
    return password.length < minLength;
  }

  handleChange() {
    const { changeCallback, minScore, userInputs, minLength, showIndicator } = this.props;
    const password = this.passwordStrengthInput.value;
    if (!showIndicator) {
      this.setState({
        password,
      }, () => {
        if (changeCallback !== null) {
          changeCallback(this.state, result);
        }
      });
      return;
    }

    let score = 0;
    let result = null;

    // always sets a zero score when min length requirement is not met
    // avoids unnecessary zxcvbn computations (CPU intensive)
    if (this.isTooShort(password, minLength) === false) {
      result = zxcvbn(password, userInputs);
      score = result.score;
    }

    this.setState({
      isValid: score >= minScore,
      password,
      score,
    }, () => {
      if (changeCallback !== null) {
        changeCallback(this.state, result);
      }
    });
  }

  showPasswordHandler() {
    this.setState({
      fieldType: 'text'
    });
  }

  hidePasswordHandler() {
    this.setState({
      fieldType: 'password'
    });
  }

  render() {
    const { score, password, isValid } = this.state;
    const {
      scoreWords,
      inputProps,
      className,
      style,
      tooShortWord,
      minLength,
      showIndicator,
    } = this.props;

    // Defines wrapper classes.
    const wrapperClasses = ['password-strength'];
    if (className) {
      wrapperClasses.push(className);
    }
    if (showIndicator) {
      wrapperClasses.push('with-indicator');
    }
    if (password.length > 0) {
      wrapperClasses.push(`is-strength-${score}`);
    }

    // Defines description.
    const strengthDesc = (
      this.isTooShort(password, minLength)
        ? tooShortWord
        : scoreWords[score]
    );

    // Defines input classes.
    const inputClasses = ['form-control'];
    if (isValid === true) {
      inputClasses.push('is-password-valid');
    }
    else if (password.length > 0) {
      inputClasses.push('is-password-invalid');
    }
    if (inputProps && inputProps.className) {
      inputClasses.push(inputProps.className);
    }

    return (
      <div className={wrapperClasses.join(' ')} style={style}>
        <input
          type={this.state.fieldType}
          {...inputProps}
          className={inputClasses.join(' ')}
          onChange={this.handleChange.bind(this)}
          ref={ref => this.passwordStrengthInput = ref}
          value={password}
        />
        {inputProps.id && inputProps.label &&
          <label htmlFor={inputProps.id}>{inputProps.label}</label>
        }

        <span className="show-password-button"
              onMouseDown={this.showPasswordHandler.bind(this)}
              onTouchStart={this.showPasswordHandler.bind(this)}
              onMouseUp={this.hidePasswordHandler.bind(this)}
              onTouchEnd={this.hidePasswordHandler.bind(this)}>

          {this.state.fieldType == 'password' &&
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17">
              <path fill="#B2B2B2" fill-rule="nonzero"
                    d="M12 5.455A3.273 3.273 0 1 0 12 12a3.273 3.273 0 0 0 0-6.545zm0 8.727a5.455 5.455 0 1 1 0-10.91 5.455 5.455 0 0 1 0 10.91zM12 .545C6.545.545 1.887 3.938 0 8.727c1.887 4.79 6.545 8.182 12 8.182s10.113-3.393 12-8.182C22.113 3.938 17.455.545 12 .545z"/>
            </svg>
          }
          {this.state.fieldType == 'text' &&
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17">
              <path fill="#B2B2B2" fill-rule="nonzero"
                    d="M12 5.455A3.273 3.273 0 1 0 12 12a3.273 3.273 0 0 0 0-6.545zm0 8.727a5.455 5.455 0 1 1 0-10.91 5.455 5.455 0 0 1 0 10.91zM12 .545C6.545.545 1.887 3.938 0 8.727c1.887 4.79 6.545 8.182 12 8.182s10.113-3.393 12-8.182C22.113 3.938 17.455.545 12 .545z"/>
            </svg>
          }
        </span>

        {showIndicator &&
          <div className="password-strength-indicator">
            <div className="indicator-bar"/>
            <span className="indicator-desc">{strengthDesc}</span>
          </div>
        }
      </div>
    );
  }
}

PasswordStrength.propTypes = {
  changeCallback: PropTypes.func,
  className: PropTypes.string,
  showIndicator: PropTypes.bool,
  defaultValue: PropTypes.string,
  inputProps: PropTypes.object,
  minLength: PropTypes.number,
  minScore: PropTypes.number,
  tooShortWord: PropTypes.string,
  scoreWords: PropTypes.array,
  userInputs: PropTypes.array,
}

PasswordStrength.defaultProps = {
  changeCallback: null,
  className: '',
  defaultValue: '',
  minLength: 3,
  minScore: 2,
  showIndicator: false,
  tooShortWord: 'To Short',
  scoreWords: ['Weak', 'Okay', 'Good', 'Strong', 'Very Strong'],
  userInputs: [],
}

export default PasswordStrength;