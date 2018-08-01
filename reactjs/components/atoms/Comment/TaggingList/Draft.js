import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import editorStyles from './editorStyles.css';

export default class SimpleMentionEditor extends Component {
  mentions = [
    {
      name: 'Matthew Russell',
      link: 'https://twitter.com/mrussell247',
      avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
    },
    {
      name: 'Julian Krispel-Samsel',
      link: 'https://twitter.com/juliandoesstuff',
      avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
    },
    {
      name: 'Jyoti Puri',
      link: 'https://twitter.com/jyopur',
      avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
    },
    {
      name: 'Max Stoiber',
      link: 'https://twitter.com/mxstbr',
      avatar: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg',
    },
    {
      name: 'Nik Graf',
      link: 'https://twitter.com/nikgraf',
      avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
    },
    {
      name: 'Pascal Brandt',
      link: 'https://twitter.com/psbrandt',
      avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
    },
  ];

  constructor(props) {
    super(props);

    this.mentionPlugin = createMentionPlugin();
  }

  state = {
    editorState: EditorState.createEmpty(),
    suggestions: this.mentions,
  };

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.mentions),
    });
  };

  onAddMention = () => {
    // get the mention object selected
  }

  focus = () => {
    this.editor.focus();
  };

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];

    return (
      <div className={editorStyles.editor} onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={element => { this.editor = element; }}
        />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          onAddMention={this.onAddMention}
        />
      </div>
    );
  }
}
