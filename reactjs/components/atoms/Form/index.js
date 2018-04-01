import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-jsonschema-form';
import FieldTemplate from './FieldTemplate';

class DefaultForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleSubmit(data) {
    this.props.onSubmit(data);
  }

  handleError(data) {
    this.props.onError(data);
  }

  render() {
    const {
      schema, uiSchema, children, className, autocomplete, ...attributes
    } = this.props;
    return (
      <Form
        className={`form ${className}`}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit}
        onError={this.handleError}
        formData={this.props.formData}
        FieldTemplate={FieldTemplate}
        showErrorList={false}
        autocomplete={autocomplete}
        {...attributes}
      >
        {children}
      </Form>
    );
  }
}

DefaultForm.defaultProps = {
  schema: {},
  uiSchema: {},
  formData: {},
  onSubmit: () => { },
  onError: () => { },
  children: {},
  className: '',
  autocomplete: 'on',
};

DefaultForm.propTypes = {
  autocomplete: PropTypes.string,
  className: PropTypes.string,
  formData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  schema: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  uiSchema: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onSubmit: PropTypes.func,
  onError: PropTypes.func,
  children: PropTypes.node,
};

export default DefaultForm;
