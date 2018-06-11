import React from 'react';
import PropTypes from 'prop-types';
import { getThumbnailUrl } from '../../../../utils/video-thumbnail-url';
import SearchItem from '../Item';
import Icon from '../../Icons/Lesson';

class MediaItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      thumbUrls: [],
    };
  }

  async getThumbnailUrls() {
    const { searchItem } = this.props;
    const { entity } = searchItem;
    const mediaItems = [];

    for (let block of entity.blocks) {
      let item = null;
      if (block.type === 'image_centered_caption') {
        item = <img src={block.image.uri.url} key={block.id} alt="" />;
      }
      else if (block.type === 'media_video') {
        const videoUrl = await getThumbnailUrl(block.url.uri);
        item = <img src={videoUrl} key={block.id} alt="" />;
      }
      mediaItems.push(item);
    }

    return mediaItems;
  }

  async componentDidMount() {
    // Prepares list of media urls.
    const mediaItems = await this.getThumbnailUrls();
    console.log(mediaItems);
    this.setState({
      thumbUrls: mediaItems,
    });
  }


  render() {
    const { searchItem } = this.props;
    const { entity, type } = searchItem;
    const { title, url } = entity;

    return (
      <SearchItem
        icon={Icon}
        title={`<span class="thin">From</span> ${title}`}
        body=""
        className={type}
        itemLink={url}
      >
        {this.state.thumbUrls}
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
