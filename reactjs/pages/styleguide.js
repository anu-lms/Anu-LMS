import React from 'react';
import App from '../application/App';
import Button from '../components/atoms/Button';
import Form from '../components/atoms/Form';

const schema = {
  'type': 'object',
  'required': ['username'],
  'properties': {
    'username': {
      'type': 'string',
      'title': 'Username',
    },
  },
};

const uiSchema = {
  'username': {
    'ui:placeholder': ' ',
  },
};

const FrontPage = () => (
  <App>
    <div className="container">
      <div className="row">

        <div className="col-12 col-md-4">
          <h1>H1 Headline<br />H1 Second line</h1>
          <h2>H2 Headline<br />H2 Second line</h2>
          <h3>H3 Headline<br />H3 Second line</h3>
          <h4>H4 Headline<br />H4 Second line</h4>
          <h5>H5 Headline<br />H5 Second line</h5>
          <p>Text</p>
          <p className="bold">Text bold</p>
          <div className="caption">Caption</div>
          <div className="caption sm">Small caption</div>
          <div className="caption sm bold">Small caption bold</div>
          <div className="caption xs">Extra small caption</div>
        </div>

        <div className="col-12 col-md-4">
          <Button type="primary">Primary button</Button>
          <Button type="secondary">Secondary button</Button>
          <Button type="link">Link button</Button>
          <Button type="primary" loading>Loading...</Button>
        </div>

        <div className="col-12 col-md-4">
          <Form
            schema={schema}
            uiSchema={uiSchema}
          >
            <Button type="primary" block>Submit</Button>
          </Form>
        </div>

      </div>
    </div>
  </App>
  );

export default FrontPage;
