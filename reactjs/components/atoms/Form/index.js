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
    const { children, className } = this.props;
    return (
      <Form
        {...this.props}
        className={`form ${className}`}
        onSubmit={this.handleSubmit.bind(this)}
        onError={this.handleError.bind(this)}
        FieldTemplate={FieldTemplate}
        showErrorList={false}
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

export default DefaultForm;
