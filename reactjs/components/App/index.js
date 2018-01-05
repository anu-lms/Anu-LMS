import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../ProgressBar'; // Do not remove!
import GlobalHeader from '../GlobalHeader/index';
import GlobalFooter from '../GlobalFooter/index';

const App = ({ children, menuData, footerData, logoData, title, subTitle, imagePath, domain, siteName }) => (
  <div>
    <GlobalHeader
      siteName={siteName}
      menuData={menuData}
      title={title}
      subTitle={subTitle}
      logoData={logoData}
      domain={domain}
    />
    { children }
    <GlobalFooter footerData={footerData} domain={domain} siteName={siteName} />
  </div>
);

App.propTypes = {
  siteName: PropTypes.string,
  domain: PropTypes.string,
  logoData: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    edit: PropTypes.string,
  }),
  children: PropTypes.arrayOf(
    PropTypes.node
  ).isRequired,
  menuData: PropTypes.shape({
    menu: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
      sections: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
        subSections: PropTypes.arrayOf(PropTypes.shape({
          name: PropTypes.string,
          url: PropTypes.string,
        })),
      })),
    })),
    edit: PropTypes.string,
  }),
  footerData: PropTypes.shape({
    edit: PropTypes.string,
  }),
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

export default App;
