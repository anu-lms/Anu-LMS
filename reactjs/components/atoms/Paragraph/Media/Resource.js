import React from 'react';
import PropTypes from 'prop-types';
import { humanizeFileName } from '../../../../utils/string';
import ClientAuth from '../../../../auth/clientAuth';
import * as privateFileHelper from '../../../../helpers/privateFile';

class Resource extends React.Component {

  constructor(props) {
    super(props);

    this.onFileDownloadClick = this.onFileDownloadClick.bind(this);
  }

  componentDidMount() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  componentDidUpdate() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  /**
   * Handle file download click.
   */
  async onFileDownloadClick() {
    const { privatefile } = this.props;

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = await auth.getAccessToken();

    //
    window.location.href = privateFileHelper.downloadUrl(privatefile.fid, accessToken);
  }

  render() {
    const { privatefile, title, columnClasses } = this.props;
    return (
      <div className="container resource">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="inner">

              <div className="download" onClick={this.onFileDownloadClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17">
                  <g fill="none" fillRule="evenodd">
                    <path fillRule="nonzero" d="M14 6h-4V0H4v6H0l7 7 7-7zM0 15v2h14v-2H0z"/>
                  </g>
                </svg>
              </div>

              <div className="title" onClick={this.onFileDownloadClick}>
                {title.length > 0 && title}
                {!title.length &&
                humanizeFileName(privatefile.filename)
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

Resource.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
  }),
};

Resource.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  columnClasses: PropTypes.array,
  settings: PropTypes.object,
  title: PropTypes.string,
  handleParagraphLoaded: PropTypes.func,
  privatefile: PropTypes.shape({
    url: PropTypes.string,
    fid: PropTypes.number,
    filename: PropTypes.string,
  }),
};

export default Resource;
