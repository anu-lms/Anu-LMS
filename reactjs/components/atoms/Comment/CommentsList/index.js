import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring, presets } from 'react-motion';
import Comment from '../CommentItem';
// import AddCommentForm from '../AddCommentForm';

class CommentsList extends React.Component {
  constructor(props, context) {
    super(props, context);
  }


  // actual animation-related logic
  getDefaultStyles = () => {
    return this.props.comments.map(comment => ({ ...comment, key: String(comment.id), style: { height: 0, opacity: 1 } }));
  }

  getStyles = () => {
    const { comments } = this.props;

    return comments
      .map(comment => ({
        ...comment,
        data: comment,
        key: String(comment.id),
        style: {
          height: spring(120, presets.gentle),
          opacity: spring(1, presets.gentle),
        },
      }));
  }

  willEnter() {
    return null;
    return {
      height: 0,
      opacity: 1,
    };
  }

  willLeave() {
    return null;
    return {
      height: spring(0),
      opacity: spring(0),
    };
  }

  render() {
    const { comments } = this.props;

    return (
      <div className="comments-list">
        <TransitionMotion
          defaultStyles={this.getDefaultStyles()}
          styles={this.getStyles()}
          willLeave={this.willLeave}
          willEnter={this.willEnter}
        >

          {styles =>
            <div className="todo-list">
              {styles.map(({ key, style, data }) => {
                return (
                  <div key={key} style={style}>
                    <Comment comment={data} key={data.id} />
                  </div>
                );
              })}
            </div>
          }

          {/*<Comment comment={rootComment.data} key={rootComment.data.id} />*/}



          {/*{comments.map(rootComment => ([*/}
            {/*// Output Root comment.*/}
            {/*<Comment comment={rootComment} key={rootComment.id} />,*/}

            {/*// Output children comments.*/}
            {/*rootComment.children.map(comment => (*/}
              {/*<Comment comment={comment} key={comment.id} />*/}
            {/*)),*/}
          {/*]))}*/}

        </TransitionMotion>
        {/* <AddCommentForm key={`${rootComment.id}-form`} />, */}
      </div>
    );
  }
}


CommentsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommentsList;
