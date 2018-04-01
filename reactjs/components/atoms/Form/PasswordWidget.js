import React from 'react';
import PropTypes from 'prop-types';
import Password from '../FormElement/Password';

const PasswordWidget = ({
  id, label, required, placeholder, options, onChange,
}) => {
  let classes = [];
  if (options.with_confirm_field) {
    classes.push('with-confirm-field');
  }
  return (
    <Password
      className={classes.join(' ')}
      showIndicator={options.indicator}
      changeCallback={(state) => { onChange(state.password); }}
      inputProps={{
 id, label, required, placeholder,
}}
    />
  );
};

PasswordWidget.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func,
};

export default PasswordWidget;
