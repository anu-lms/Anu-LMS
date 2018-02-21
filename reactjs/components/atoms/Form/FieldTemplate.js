import React from 'react';

// Custom JSON Schema field template with float labels. See:
// 1. https://github.com/mozilla-services/react-jsonschema-form#field-template
// 2. https://github.com/tonystar/bootstrap-float-label
export default props => {
  const { id, classNames, label, help, required, description, children, schema, uiSchema } = props;

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
}
