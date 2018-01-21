import React from 'react';
import App from '../application/App';
import Test from '../components/atoms/Test';
import { Link } from '../routes';
import withAuth from '../auth/withAuth';

const Page = () => (
  <App>
    <Link to="/"><a style={{ color: 'black' }}>To the home page</a></Link>
  </App>
);

export default withAuth(Page);
