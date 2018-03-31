import React from 'react';
import PropTypes from 'prop-types';

// Custom JSON Schema field template with float labels. See:
// 1. https://github.com/mozilla-services/react-jsonschema-form#field-template
// 2. https://github.com/tonystar/bootstrap-float-label
const FieldTemplate = (props) => {
  const { id, classNames, label, help, description, children, schema } = props;

  let innerClasses = 'field-inner';

  if (schema.type === 'string' || schema.type === 'number') {
    innerClasses += ' has-float-label';
  }

  return (
    <div className={`${classNames}`}>
      {description}
      <div className={innerClasses}>
        {children}
        {schema.type !== 'boolean' &&
          <label htmlFor={id}>{label}</label>
        }
      </div>
      {help}
    </div>
  );
};

FieldTemplate.propTypes = {
  id: PropTypes.string,
  classNames: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  // eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
  uiSchema: PropTypes.object,
  children: PropTypes.node,
};

export default FieldTemplate;
