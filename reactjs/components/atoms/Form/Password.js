import React from 'react';
import ReactPasswordStrength from 'react-password-strength';

const Password = (props) => {
  let classes = [];
  if (props.options.indicator) {
    classes.push('with-indicator');
  }
  if (props.options.with_confirm_field) {
    classes.push('with-confirm-field');
  }
  return (
    <ReactPasswordStrength
      className={classes.join(' ')}
      style={{  }}
      minLength={3}
      minScore={2}
      changeCallback={(state) => { props.onChange(state.password) }}
      scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Very Strong']}
      tooShortWord='Short'
      inputProps={{ className: 'form-control', id: props.id, label: props.label, required: props.required, placeholder: props.placeholder }}
    />
  );
}

export default Password;