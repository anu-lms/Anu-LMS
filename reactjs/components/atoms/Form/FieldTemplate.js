import React from 'react';
import PropTypes from 'prop-types';

// Custom JSON Schema field template with float labels. See:
// 1. https://github.com/mozilla-services/react-jsonschema-form#field-template
// 2. https://github.com/tonystar/bootstrap-float-label
const FieldTemplate = ({
  id, classNames, label, help, description, children, schema,
}) => {
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
          // eslint-disable-next-line jsx-a11y/label-has-for
          <label htmlFor={id}>{label}</label>
        }
      </div>
      {help}
    </div>
  );
};

FieldTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  classNames: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  description: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  required: PropTypes.bool,
  schema: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  // eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
  uiSchema: PropTypes.object,
  children: PropTypes.node.isRequired,
};

FieldTemplate.defaultProps = {
  required: false,
  classNames: '',
  label: '',
  description: {},
  help: {},
  uiSchema: {},
};

export default FieldTemplate;
