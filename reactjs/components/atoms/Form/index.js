import React from 'react';
import Form from 'react-jsonschema-form';
import FieldTemplate from './FieldTemplate';

class DefaultForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      formData: props.formData,
      isSubmitting: false,
    };

    this.onSubmit.bind(this);
    this.onError.bind(this);
  }

  onSubmit(data) {
    console.log(data);
    this.props.onSubmit(data);

  }

  onError(data) {
    console.log(data);
    this.props.onError(data);
  }

  render() {
    const { schema, uiSchema, children, className, autocomplete } = this.props;
    return (
      <Form
        className={`form ${className}`}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.onSubmit}
        onError={this.onError}
        formData={this.state.formData}
        FieldTemplate={FieldTemplate}
        showErrorList={false}
        autocomplete={autocomplete}
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
