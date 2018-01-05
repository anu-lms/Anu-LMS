import React from 'react';

const AdminLinkForEdit = ({ link, children }, context) => (
  <div style={{position: 'relative'}}>
    {!!link && <a href={`${link}?destination=${context.pathname}`} >
      <i className="bigbox-icon-pencil" />
    </a>}
    {children}
  </div>
);

AdminLinkForEdit.contextTypes = {
  pathname: React.PropTypes.string
};

export default AdminLinkForEdit;
