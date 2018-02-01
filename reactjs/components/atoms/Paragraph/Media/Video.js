import React from 'react';
import PropTypes from 'prop-types';
import Player from 'react-player';

const Video = ({ url }) => (
  <div className="container video">
    <div className="row">
      <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
        <Player url={url.uri} width={'100%'} />
      </div>
    </div>
  </div>
);

Video.propTypes = {
  url: PropTypes.shape({
    uri: PropTypes.string,
    title: PropTypes.string,
  }),
  type: PropTypes.string,
  settings: PropTypes.object,
};

export default Video;
