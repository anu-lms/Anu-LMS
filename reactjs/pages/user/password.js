import React from 'react';
import App from '../../application/App';
import withAuth from '../../auth/withAuth';
import Header from '../../components/organisms/Header';
import EditPasswordForm from '../../components/moleculas/Form/Password/Edit';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';

const UserPasswordPage = () => (
  <App>
    <Header />
    <div className="page-with-header page-password">
      <OneColumnLayout pageTitle="Edit Password" className="short">
        <EditPasswordForm />
      </OneColumnLayout>
    </div>
  </App>
);

export default withAuth(UserPasswordPage);
