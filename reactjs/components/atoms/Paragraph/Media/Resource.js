import React from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import { Page } from 'react-pdf';
import { Document } from 'react-pdf/dist/entry.noworker';
import ClientAuth from '../../../../auth/clientAuth';
import { humanizeFileName } from '../../../../utils/string';
import * as breakpoints from '../../../../utils/breakpoints';
import * as privateFileHelper from '../../../../helpers/privateFile';
import ShowCommentsCTA from '../../../moleculas/Lesson/ShowCommentsCTA';
import Overlay from '../../../atoms/Overlay';

class Resource extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileDisplay: false,
      filePages: 0,
      fileLoaded: false,
      fileDisplayWidth: 800,
      fileLoadError: false,
    };

    this.onFileViewOpen = this.onFileViewOpen.bind(this);
    this.onFileViewClose = this.onFileViewClose.bind(this);
    this.onFileLoadSuccess = this.onFileLoadSuccess.bind(this);
    this.onFileLoadError = this.onFileLoadError.bind(this);
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
    if (this.state.fileDisplay !== true) {
      return;
    }
    this.setState({
      fileDisplay: false,
      fileLoaded: false,
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
      fileLoadError: false,
    });
  }

  /**
   * Handle error event for file loading.
   */
  onFileLoadError() {
    this.setState({
      fileLoaded: true,
      fileLoadError: true,
    });
  }

  render() {
    const { privatefile, title, columnClasses, id, commentsAllowed } = this.props;
    return (
      <div className="container resource">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <div className="inner">

              <div className="download-link" onClick={this.onFileDownloadClick} onKeyPress={this.onFileDownloadClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17">
                  <g fill="none" fillRule="evenodd">
                    <path fillRule="nonzero" d="M14 6h-4V0H4v6H0l7 7 7-7zM0 15v2h14v-2H0z" />
                  </g>
                </svg>
              </div>

              <div className="title" onClick={this.onFileViewOpen} onKeyPress={this.onFileViewOpen}>
                {!_isEmpty(title) && title}
                {_isEmpty(title) && humanizeFileName(privatefile.filename)}
              </div>

              {this.state.fileDisplay &&
              <Overlay
                onClose={this.onFileViewClose}
                isLoading={!this.state.fileLoaded}
                isError={this.state.fileLoadError}
                navigation={[
                  <div className="download cta" onClick={this.onFileDownloadClick}>
                    <div className="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 29">
                        <g fill="none" fillRule="evenodd">
                          <path fillRule="nonzero" d="M23.667 10H17V0H7v10H.333L12 21.667 23.667 10zM.333 25v3.333h23.334V25H.333z"/>
                        </g>
                      </svg>
                    </div>
                    <div className="label">Download</div>
                </div>]}
              >

                <Document
                  file={this.state.fileUrl}
                  onLoadSuccess={this.onFileLoadSuccess}
                  onLoadError={this.onFileLoadError}
                  loading=""
                >

                {this.state.fileLoaded && Array.from(new Array(this.state.filePages), (el, index) => (
                  <Page
                    key={index}
                    pageNumber={index + 1}
                    scale={1}
                    width={this.state.fileDisplayWidth}
                    renderAnnotations={false}
                  />))}

                </Document>

              </Overlay>
              }

            </div>

            {commentsAllowed && <ShowCommentsCTA paragraphId={id}/>}
          </div>
        </div>
      </div>);
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
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  title: PropTypes.string,
  handleParagraphLoaded: PropTypes.func,
  privatefile: PropTypes.shape({
    fid: PropTypes.number, filename: PropTypes.string,
  }).isRequired,
  commentsAllowed: PropTypes.bool,
};

Resource.defaultProps = {
  id: undefined,
  title: '',
  type: '',
  columnClasses: [],
  settings: {},
  commentsAllowed: true,
  handleParagraphLoaded: () => {
  },
};

export default Resource;
