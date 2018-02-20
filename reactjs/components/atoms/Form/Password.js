import React from 'react';
import ReactPasswordStrength from 'react-password-strength';

const Password = (props) => {
  const classes = props.options.indicator ? 'with-indicator' : '';
  return (
    <ReactPasswordStrength
      className={classes}
      style={{  }}
      minLength={3}
      minScore={2}
      changeCallback={(state) => { props.onChange(state.password) }}
      scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
      inputProps={{ className: 'form-control', id: props.id, label: props.label, required: props.required, placeholder: props.placeholder }}
    />
  );
}

export default Password;