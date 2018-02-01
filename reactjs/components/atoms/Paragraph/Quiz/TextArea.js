import React  from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';
import {paragraphComponents} from "../index";

class TextArea extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    console.log('id: ' + this.props.id);
    console.log(this.textarea.value);
  }

  render() {
    const { title, blocks } = this.props;
    return (
      <div className="container quiz textarea">
        <div className="row">
          <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
            <div className="title">{title}</div>

            {blocks.length > 0 &&
            <div className="blocks">
              {blocks.map((block, index) => {
                const Paragraph = paragraphComponents[block.type];
                return <Paragraph key={index} {...block} />;
              })}
            </div>
            }

            <TextareaAutosize
              rows={3}
              innerRef={ref => this.textarea = ref}
              onChange={this.handleChange}
              placeholder="Type your response..."
            />
          </div>
        </div>
      </div>
    );
  };
}

TextArea.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  blocks: PropTypes.arrayOf(PropTypes.shape), // Other paragraphs.
};

TextArea.defaultProps = {
  blocks: [],
};

export default TextArea;
