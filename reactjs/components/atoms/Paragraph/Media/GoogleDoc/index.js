import React from 'react';
import PropTypes from 'prop-types';
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
    const { gdoc_link, columnClasses, id, commentsAllowed } = this.props;
    return (
      <div id={`paragraph-${id}`} className="container paragraph google-doc">
        <div className="row">
          <div className={columnClasses.join(' ')}>
            <iframe
              allowFullScreen=""
              src={gdoc_link.uri}
              tabIndex="-1"
            />

            {commentsAllowed &&
              <ShowCommentsCTA paragraphId={id} />
            }
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
  text: PropTypes.shape({
    value: PropTypes.string,
    format: PropTypes.string,
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
