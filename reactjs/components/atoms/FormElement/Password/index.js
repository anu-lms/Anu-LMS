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
    if (!showIndicator) {
      return;
    }
    const password = this.passwordStrengthInput.value;

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

    const inputClasses = ['password-strength-input'];
    const wrapperClasses = ['password-strength'];
    if (className) {
      wrapperClasses.push(className);
    }
    if (password.length > 0) {
      wrapperClasses.push(`is-strength-${score}`);
    }

    const strengthDesc = (
      this.isTooShort(password, minLength)
        ? tooShortWord
        : scoreWords[score]
    );

    if (isValid === true) {
      inputClasses.push('is-password-valid');
    } else if (password.length > 0) {
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
        <span className="password-strength-show-password" onMouseDown={this.showPasswordHandler.bind(this)} onMouseUp={this.hidePasswordHandler.bind(this)} />

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
  showIndicator: true,
  tooShortWord: 'To Short',
  scoreWords: ['Weak', 'Okay', 'Good', 'Strong', 'Very Strong'],
  userInputs: [],
}

export default PasswordStrength;