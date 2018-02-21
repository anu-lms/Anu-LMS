import React from 'react';
import Password from '../FormElement/Password';

const PasswordWidget = (props) => {
  let classes = [];
  if (props.options.with_confirm_field) {
    classes.push('with-confirm-field');
  }
  return (
    <Password
      className={classes.join(' ')}
      showIndicator={props.options.indicator}
      changeCallback={(state) => { props.onChange(state.password) }}
      inputProps={{ id: props.id, label: props.label, required: props.required, placeholder: props.placeholder }}
    />
  );
}

export default PasswordWidget;