import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import urlParse from 'url-parse';
import classNames from 'classnames';
import ShowCommentsCTA from '../../../../moleculas/Lesson/ShowCommentsCTA';

class GoogleDoc extends React.Component {
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

  render() {
    // eslint-disable-next-line camelcase
    const { gdoc_link, columnClasses, id, commentsAllowed } = this.props;

    // Parse shared link to the document.
    const parsedUrl = urlParse(gdoc_link.uri);
    let parsedUrlArray = parsedUrl.pathname.split('/');
    const docType = parsedUrlArray[1];

    // Replaces last part of url (/edit) to preview to show document in preview mode.
    parsedUrlArray[4] = docType === 'presentation' ? 'embed' : 'preview';

    // Validate given link.
    const linkIsValid = parsedUrl.host === 'docs.google.com' && parsedUrlArray[2] === 'd';

    return (
      <div id={`paragraph-${id}`} className={classNames(['container', 'paragraph', 'google-doc', `type-${docType}`])}>
        <div className="row">
          <div className={columnClasses.join(' ')}>
            {linkIsValid ? (
              <Fragment>
                <iframe title="Google document" allowFullScreen src={parsedUrl.origin + parsedUrlArray.join('/')} />

                {commentsAllowed &&
                  <ShowCommentsCTA paragraphId={id} />
                }
              </Fragment>
            ) : (
              <div>Link to the google document is broken, please contact site administrator.</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

GoogleDoc.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string,
  columnClasses: PropTypes.arrayOf(PropTypes.string),
  settings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleParagraphLoaded: PropTypes.func,
  gdoc_link: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  commentsAllowed: PropTypes.bool,
};

GoogleDoc.defaultProps = {
  type: '',
  columnClasses: [],
  settings: {},
  commentsAllowed: false,
  handleParagraphLoaded: () => {},
};

export default GoogleDoc;
