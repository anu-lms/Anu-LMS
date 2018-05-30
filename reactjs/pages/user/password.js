import React from 'react';
import withAuth from '../../auth/withAuth';
import withRedux from '../../store/withRedux';
import SiteTemplate from '../../components/organisms/Templates/SiteTemplate';
import EditPasswordForm from '../../components/moleculas/Form/Password/Edit';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';

const UserPasswordPage = () => (
  <SiteTemplate className="page-password">
    <OneColumnLayout pageTitle="Edit Password" className="short">
      <EditPasswordForm />
    </OneColumnLayout>
  </SiteTemplate>
);

export default withRedux(withAuth(UserPasswordPage));
