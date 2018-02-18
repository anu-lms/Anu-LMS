import React from 'react';
import Form from 'react-jsonschema-form';
import FieldTemplate from './FieldTemplate';

class DefaultForm extends React.Component {

  handleSubmit(data) {
    this.props.onSubmit(data);

  }

  handleError(data) {
    this.props.onError(data);
  }

  render() {
    const { schema, uiSchema, children, className, autocomplete, ...attributes } = this.props;
    return (
      <Form
        className={`form ${className}`}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit.bind(this)}
        onError={this.handleError.bind(this)}
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
  onSubmit: () => {},
  onError: () => {},
  children: {},
  className: '',
  autocomplete: 'on',
};

export default DefaultForm;
