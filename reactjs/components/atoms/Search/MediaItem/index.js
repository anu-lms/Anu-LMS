import React from 'react';
import PropTypes from 'prop-types';
import { getThumbnail } from '../../../../utils/video-thumbnail';
import SearchItem from '../Item';
import Icon from '../../Icons/Lesson';
import LinkWrap from '../../Link/LinkWrap';

class MediaItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      thumbnails: [],
    };
  }

  async getThumbnailsData() {
    const { searchItem } = this.props;
    const { entity } = searchItem;
    const thumbnails = [];

    for (let block of entity.blocks) {
      let item = null;
      if (block.type === 'image_centered_caption') {
        item = {
          id: block.id,
          url: block.image.uri.url,
          type: block.type,
          width: block.image.width,
          height: block.image.height,
          title: '',
        };
      }
      else if (block.type === 'media_video') {
        const thumbnail = await getThumbnail(block.url.uri);
        item = {
          id: block.id,
          url: thumbnail.url,
          type: block.type,
          width: thumbnail.width,
          height: thumbnail.height,
          title: thumbnail.title,
        };
      }
      thumbnails.push(item);
    }

    return thumbnails;
  }

  async componentDidMount() {
    // Prepares list of media urls.
    const thumbnails = await this.getThumbnailsData();

    this.setState({
      thumbnails,
    });
  }

  render() {
    const { searchItem } = this.props;
    const { entity } = searchItem;
    const { title, url } = entity;

    const mediaItems = this.state.thumbnails.map(item => {
      const mediaUrl = `${url}?section=${item.id}`;

      return (
        <LinkWrap url={mediaUrl}>
          <div className="image-wrapper">
            <img className="thumbnail-image" src={item.url} key={item.id} alt={item.title} title={item.title} />
            <img className="spinner" src="/static/img/spinner-small.svg" alt="Loading..." />
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

export default MediaItem;
