import React from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import { Page } from 'react-pdf';
import { Document } from 'react-pdf/dist/entry.noworker';
import PageLoader from '../../PageLoader';
import ClientAuth from '../../../../auth/clientAuth';
import { humanizeFileName } from '../../../../utils/string';
import * as breakpoints from '../../../../utils/breakpoints';
import * as privateFileHelper from '../../../../helpers/privateFile';

class Resource extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fileDisplay: false,
      fileViewUrl: '',
      filePages: 0,
      fileLoaded: false,
      fileDisplayWidth: 800,
    };

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onFileViewOpen = this.onFileViewOpen.bind(this);
    this.onFileViewClose = this.onFileViewClose.bind(this);
    this.onFileLoadSuccess = this.onFileLoadSuccess.bind(this);
    this.onFileDownloadClick = this.onFileDownloadClick.bind(this);
  }

  componentDidMount() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }

    // Listen to key press.
    document.addEventListener('keydown', this.onKeyPress);
  }

  componentDidUpdate() {
    // Report to the parent component that the loading is done.
    if (this.props.handleParagraphLoaded) {
      this.props.handleParagraphLoaded(this.props.id);
    }
  }

  componentWillUnmount() {
    // Stop listening for key press.
    document.removeEventListener('keydown', this.onKeyPress);
  }

  /**
   * Handle file download click.
   */
  async onFileDownloadClick() {
    const { privatefile } = this.props;

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = await auth.getAccessToken();

    // Redirect a browser to the new page.
    window.location.href = privateFileHelper.downloadUrl(privatefile.fid, accessToken);
  }

  /**
   * Handle file download click.
   */
  async onFileViewOpen() {
    const { privatefile } = this.props;

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = await auth.getAccessToken();

    document.body.classList.add('no-scroll');

    let docWidth = 800;
    if (breakpoints.isDown('lg')) {
      docWidth = breakpoints.getPageWidth();
    }

    this.setState({
      fileDisplay: true,
      fileUrl: privateFileHelper.viewUrl(privatefile.fid, accessToken),
      fileDisplayWidth: docWidth,
    });
  }

  /**
   * Handle close of viewing resource.
   */
  onFileViewClose() {
    this.setState({
      fileDisplay: false,
      fileLoaded: false
    });
    document.body.classList.remove('no-scroll');
  }

  /**
   * Handle success event for file loading.
   *
   * @param numPages
   *   Amount of pages in PDF.
   */
  onFileLoadSuccess({ numPages }) {
    this.setState({
      filePages: numPages,
      fileLoaded: true,
    });
  }

  /**
   * Close popup window with PDF on ESC press.
   */
  onKeyPress() {
    if (event.keyCode === 27 && this.state.fileDisplay === true) {
      this.onFileViewClose();
    }
  }

  render() {
    const { privatefile, title, columnClasses } = this.props;
    return (
      <div className="container resource">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="inner">

              <div className="download-link" onClick={this.onFileDownloadClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17">
                  <g fill="none" fillRule="evenodd">
                    <path fillRule="nonzero" d="M14 6h-4V0H4v6H0l7 7 7-7zM0 15v2h14v-2H0z"/>
                  </g>
                </svg>
              </div>

              <div className="title" onClick={this.onFileViewOpen}>
                {!_isEmpty(title) && title}
                {_isEmpty(title) && humanizeFileName(privatefile.filename)}
              </div>

              {this.state.fileDisplay &&
              <div className="lightbox">
                <div className="overlay" onClick={this.onFileViewClose} />

                <div className="navigation">

                  <div className="back" onClick={this.onFileViewClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
                      <g fill="none" fillRule="evenodd">
                        <path fillRule="nonzero" d="M27.333 12.333H7.05l9.317-9.316L14 .667.667 14 14 27.333l2.35-2.35-9.3-9.316h20.283z"/>
                      </g>
                    </svg>
                  </div>

                  <div className="download" onClick={this.onFileDownloadClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="29" viewBox="0 0 24 29">
                      <g fill="none" fillRule="evenodd">
                        <path fillRule="nonzero" d="M23.667 10H17V0H7v10H.333L12 21.667 23.667 10zM.333 25v3.333h23.334V25H.333z"/>
                      </g>
                    </svg>
                  </div>

                </div>

                <div className="content">

                  {!this.state.fileLoaded &&
                  <PageLoader />
                  }

                  <Document
                    file={this.state.fileUrl}
                    onLoadSuccess={this.onFileLoadSuccess}
                    loading=""
                  >

                    {this.state.fileLoaded &&
                    Array.from(new Array(this.state.filePages), (el, index) => (
                      <Page
                        key={index}
                        pageNumber={index + 1}
                        scale={1}
                        width={this.state.fileDisplayWidth}
                        renderAnnotations={false}
                      />
                    ))}

                  </Document>


                </div>

              </div>
              }

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
    fid: PropTypes.number,
    filename: PropTypes.string,
  }),
};

export default Resource;
