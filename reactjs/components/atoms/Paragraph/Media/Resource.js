import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import { Page } from 'react-pdf';
import { Document } from 'react-pdf/dist/entry.noworker';
import ClientAuth from '../../../../auth/clientAuth';
import { humanizeFileName } from '../../../../utils/string';
import * as breakpoints from '../../../../utils/breakpoints';
import * as privateFileHelper from '../../../../helpers/privateFile';
import * as overlayActions from '../../../../actions/overlay';
import ShowCommentsCTA from '../../../moleculas/Lesson/ShowCommentsCTA';

class Resource extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filePages: 0,
      fileLoaded: false,
      fileDisplayWidth: 800,
      fileLoadError: false,
    };

    this.onFileViewOpen = this.onFileViewOpen.bind(this);
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
    const { dispatch, privatefile } = this.props;

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = await auth.getAccessToken();

    // Start loading a PDF document inside of overlay window.
    // So far the document will be hidden, because the overlay will
    // be in the loading state initially. We're awaiting for the document
    // to trigger onLoadSuccess() or onLoadError() events.
    const content = (
      <Document
        file={privateFileHelper.viewUrl(123, accessToken)}
        onLoadSuccess={this.onFileLoadSuccess}
        onLoadError={this.onFileLoadError}
        loading=""
      />
    );

    // Open overlay with empty content and set its state to loading.
    dispatch(overlayActions.open(content));
    dispatch(overlayActions.loading());
  }

  /**
   * Handle success event for file loading.
   *
   * @param numPages
   *   Amount of pages in PDF.
   */
  async onFileLoadSuccess({ numPages }) {
    const { dispatch, privatefile } = this.props;

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = await auth.getAccessToken();

    // Calculate width of pdf doc to open. On smaller screens the doc
    // with take full screen, on larger - up to 800px.
    let docWidth = 800;
    if (breakpoints.isDown('lg')) {
      docWidth = breakpoints.getPageWidth();
    }

    const header = (
      <div className="download cta" onClick={this.onFileDownloadClick}>
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 29">
            <g fill="none" fillRule="evenodd">
              <path fillRule="nonzero" d="M23.667 10H17V0H7v10H.333L12 21.667 23.667 10zM.333 25v3.333h23.334V25H.333z"/>
            </g>
          </svg>
        </div>
        <div className="label">Download</div>
      </div>
    );

    const content = (
      <Document
        file={privateFileHelper.viewUrl(privatefile.fid, accessToken)}
        onLoadSuccess={this.onFileLoadSuccess}
        onLoadError={this.onFileLoadError}
        loading=""
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            scale={1}
            width={docWidth}
            renderAnnotations={false}
          />
        ))}
      </Document>
    );

    // Open overlay with empty content and set its state to loading.
    dispatch(overlayActions.open(content, header));
  }

  /**
   * Handle error event for file loading.
   */
  onFileLoadError() {
    // Tell overlay that the loading is over, but an error occurred.
    // Open overlay with empty content and set its state to loading.
    this.props.dispatch(overlayActions.error('Sorry, we could not load the file.'));
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
  handleParagraphLoaded: () => {},
};

export default connect()(Resource);
