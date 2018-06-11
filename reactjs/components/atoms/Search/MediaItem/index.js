import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getThumbnail } from '../../../../utils/video-thumbnail';
import SearchItem from '../Item';
import Icon from '../../Icons/Lesson';
import VideoPlay from '../../Icons/VideoPlay';
import LinkWrap from '../../Link/LinkWrap';
import SearchLoader from '../Loader';
import * as searchActions from '../../../../actions/search';
import * as overlayActions from '../../../../actions/overlay';

class MediaItem extends React.Component {
  constructor(props) {
    super(props);
    const { searchItem } = this.props;

    // Defines initial thumbnail images, showing loading circle by default.
    const thumbnails = searchItem.entity.blocks.map(item => ({
      id: item.id,
      type: item.type,
      title: '',
      url: '',
    }));

    this.state = {
      thumbnails,
    };
    this.onItemClick = this.onItemClick.bind(this);
  }

  async componentDidMount() {
    // Prepares list of media urls.
    const thumbnails = await this.getThumbnailsData();

    // Updates list of thumbnails.
    this.setState({
      thumbnails,
    });
  }

  /**
   * Closes overlay on item click.
   */
  onItemClick() {
    const { dispatch } = this.props;
    dispatch(overlayActions.close());
    dispatch(searchActions.clear());
  }

  async getThumbnailsData() {
    const { searchItem } = this.props;
    const { entity } = searchItem;
    const thumbnails = [];

    for (let block of entity.blocks) {
      let item = null;
      if (block.type === 'image_centered_caption') {
        item = {
          url: block.image.uri.url,
          width: block.image.width,
          height: block.image.height,
          title: '',
        };
      }
      else if (block.type === 'media_video') {
        const thumbnail = await getThumbnail(block.url.uri);
        item = {
          url: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height,
          title: thumbnail.title,
        };
      }
      thumbnails.push({
        id: block.id,
        type: block.type,
        ...item,
      });
    }

    return thumbnails;
  }

  render() {
    const { searchItem } = this.props;
    const { entity } = searchItem;
    const { title, url } = entity;

    const mediaItems = this.state.thumbnails.map(item => {
      let imageStyles = {};
      if (item.url) {
        imageStyles.backgroundImage = `url(${item.url})`;
      }

      return (
        <LinkWrap url={`${url}?section=${item.id}`}>
          <div
            className="image-wrapper"
            key={item.id}
            onClick={this.onItemClick}
            onKeyPress={this.onItemClick}
          >
            <div style={imageStyles} className="thumbnail-image" title={item.title} />
            <SearchLoader />

            {item.type === 'media_video' &&
              <div className="play-icon"><VideoPlay /></div>
            }
          </div>
        </LinkWrap>
      );
    });

    return (
      <SearchItem
        icon={Icon}
        title={`<span class="thin">From</span> ${title}`}
        body=""
        className="media"
      >
        <div className="thumbnails">{mediaItems}</div>
      </SearchItem>
    );
  }
}

MediaItem.propTypes = {
  searchItem: PropTypes.shape({
    type: PropTypes.string,
    excerpt: PropTypes.string,
    entity: PropTypes.object,
  }).isRequired,
};

export default connect()(MediaItem);
