import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import EditList from 'slate-edit-list'
import { isKeyHotkey } from 'is-hotkey';
import he from 'he';
import isUrl from 'is-url';

// IE 11: Object doesn't support property or method 'includes'.
import 'core-js/es7/array';

// IE 11: Object doesn't support property or method 'closest'.
import '../../../utils/polyfill/closest';

import { html } from './serializer';

const pluginEditList = EditList({
  types: ['bulleted-list', 'numbered-list'],
  typeItem: 'list-item',
  typeDefault: 'paragraph'
});

const plugins = [
  pluginEditList
];

/**
 * A change helper to standardize wrapping links.
 *
 * @param {Change} change
 * @param {String} href
 */
function wrapLink(change, href) {
  change.wrapInline({
    type: 'link',
    data: { href },
  });

  change.collapseToEnd();
}

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Change} change
 */
function unwrapLink(change) {
  change.unwrapInline('link');
}

/**
 * Define the default node type.
 *
 * @type {String}
 */
const DEFAULT_NODE = 'paragraph';

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */
const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

/**
 * The rich text example.
 *
 * @type {Component}
 */
class RichEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: false,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ value: html.deserialize(this.props.initialValue) });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ value: html.deserialize(this.props.initialValue) });
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */
  onChange = ({ value }) => {
    this.setState({ value });

    // Trigger any external handler.
    if (this.props.onChange) {
      const htmlValue = html.serialize(value);
      this.props.onChange(he.decode(htmlValue));
    }
  };

  /**
   * When clicking a link, if the selection has a link in it, remove the link.
   * Otherwise, add a new link with an href and text.
   *
   * @param {Event} event
   */
  onClickLink = event => {
    event.preventDefault();
    const { value } = this.state;
    const hasLinks = this.hasLinks();
    const change = value.change();

    if (hasLinks) {
      change.call(unwrapLink);
    }
    else if (value.isExpanded) {
      const href = window.prompt('Enter the URL of the link:'); // eslint-disable-line no-alert
      change.call(wrapLink, href);
    }
    else {
      const href = window.prompt('Enter the URL of the link:'); // eslint-disable-line no-alert
      const text = window.prompt('Enter the text for the link:'); // eslint-disable-line no-alert
      change
        .insertText(text)
        .extend(0 - text.length)
        .call(wrapLink, href);
    }

    this.onChange(change);
  };

  /**
   * On paste, if the text is a link, wrap the selection in a link.
   *
   * @param {Event} event
   * @param {Change} change
   */
  onPaste = (event, change) => {
    if (change.value.isCollapsed) return;

    const transfer = getEventTransfer(event); // eslint-disable-line no-undef
    const { type, text } = transfer;
    if (type !== 'text' && type !== 'html') return;
    if (!isUrl(text)) return;

    if (this.hasLinks()) {
      change.call(unwrapLink);
    }

    change.call(wrapLink, text);
    return true; // eslint-disable-line consistent-return
  };

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */
  onKeyDown = (event, change) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = 'bold';
    }
    else if (isItalicHotkey(event)) {
      mark = 'italic';
    }
    else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    }
    else if (isCodeHotkey(event)) {
      mark = 'code';
    }
    else {
      return;
    }

    event.preventDefault();
    change.toggleMark(mark);
    return true; // eslint-disable-line consistent-return
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    const change = value.change();
    const { document } = value;

    const {
      wrapInList,
      unwrapList,
      increaseItemDepth,
      decreaseItemDepth
    } = pluginEditList.changes;
    const isList = pluginEditList.utils.isSelectionInList(value);

    debugger;
    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);

      if (isList) {
        change
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      }
      else {
        change.setBlock(isActive ? DEFAULT_NODE : type);
      }
    }
    else {
      // Handle the extra wrapping required for list buttons.
      // eslint-disable-next-line max-len
      const isType = value.blocks.some(block => !!document.getClosest(block.key, parent => parent.type === type));

      if (isList && isType) {
        change
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      }
      else if (isList) {
        change
          .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type);
      }
      else {
        change.setBlock('list-item').wrapBlock(type);
      }
    }

    this.onChange(change);
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasBlock = type => {
    const { value } = this.state;
    //debugger;
    const aaa = pluginEditList.utils.getCurrentList(value);
    if (aaa) {
      console.log('aaaBlocks', aaa.blocks);
    }
    console.log('aaa', aaa);
    return value.blocks.some(node => {console.log(node); return node.type === type});
  };

  /**
   * Check whether the current selection has a link in it.
   *
   * @return {Boolean} hasLinks
   */
  hasLinks = () => {
    const { value } = this.state;
    return value.inlines.some(inline => inline.type === 'link');
  };

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @return {Element}
   */
  renderMarkButton = type => {
    const isActive = this.hasMark(type);
    const onMouseDown = event => this.onClickMark(event, type);

    let icon;
    switch (type) {
      case 'bold':
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="18" viewBox="0 0 11 18">
            <path fillRule="nonzero" d="M43 1v3h2.21l-3.42 8H39v3h8v-3h-2.21l3.42-8H51V1zM8.6 7.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H0v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM3 3.5h3c.83 0 1.5.67 1.5 1.5S6.83 6.5 6 6.5H3v-3zm3.5 9H3v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
          </svg>
        );
        break;

      case 'italic':
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="18" viewBox="39 0 13 18">
            <path fillRule="nonzero" d="M43 1v3h2.21l-3.42 8H39v3h8v-3h-2.21l3.42-8H51V1zM8.6 7.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H0v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM3 3.5h3c.83 0 1.5.67 1.5 1.5S6.83 6.5 6 6.5H3v-3zm3.5 9H3v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
          </svg>
        );
        break;

      case 'underlined':
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" viewBox="77 0 15 18">
            <path fillRule="nonzero" d="M85 14c3.31 0 6-2.69 6-6V0h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S81.5 9.93 81.5 8V0H79v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H78z" />
          </svg>
        );
        break;

      default:
        icon = null;
    }

    return (
      // eslint-disable-next-line react/jsx-no-bind
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        {icon}
      </span>
    );
  };

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @return {Element}
   */
  renderBlockButton = type => {
    //debugger;
    //const isActive = pluginEditList.utils.isSelectionInList(this.state.value);

    const onMouseDown = event => this.onClickBlock(event, type);

    const isActive = this.hasBlock(type);

    let icon;
    switch (type) {
      case 'numbered-list':
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="155 0 21 18">
            <path fillRule="nonzero" d="M155 14h2v.5h-1v1h1v.5h-2v1h3v-4h-3v1zm1-9h1V1h-2v1h1v3zm-1 3h1.8l-1.8 2.1v.9h3v-1h-1.8l1.8-2.1V7h-3v1zm5-6v2h14V2h-14zm0 14h14v-2h-14v2zm0-6h14V8h-14v2z" />
          </svg>
        );
        break;

      case 'bulleted-list':
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="115 0 21 18">
            <path fillRule="nonzero" d="M117 7.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zm3 2.5h14v-2h-14v2zm0-6h14V8h-14v2zm0-8v2h14V2h-14z" />
          </svg>
        );
        break;

      default:
        icon = null;
    }

    return (
      // eslint-disable-next-line react/jsx-no-bind
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        {icon}
      </span>
    );
  };

  /**
   * Render the link button.
   *
   * @return {Element} element
   */
  renderLinkButton = () => {
    const hasLinks = this.hasLinks();
    return (
      <span
        className="button"
        onMouseDown={this.onClickLink}
        data-active={hasLinks}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="195 0 20 18">
          <path fillRule="nonzero" d="M196.9 9c0-1.71 1.39-3.1 3.1-3.1h4V4h-4c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9h-4c-1.71 0-3.1-1.39-3.1-3.1zm4.1 1h8V8h-8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V14h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
        </svg>
      </span>
    );
  };

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */
  renderNode = props => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'link': {
        const href = node.data.get('href');
        return <a {...attributes} href={href}>{children}</a>;
      }
      default:
        return null;
    }
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */
  renderMark = props => {
    const { children, mark } = props;
    switch (mark.type) {
      case 'bold':
        return <strong>{children}</strong>;
      case 'italic':
        return <em>{children}</em>;
      case 'underlined':
        return <u>{children}</u>;
      default:
        return null;
    }
  }

  /**
   * Render.
   *
   * @return {Element}
   */
  render() {
    return (
      <Fragment>
        {this.state.value &&
        <div className="editor-wrapper">

          <div className="editor-menu">
            {this.renderMarkButton('bold')}
            {this.renderMarkButton('italic')}
            {this.renderMarkButton('underlined')}
            {this.renderBlockButton('numbered-list')}
            {this.renderBlockButton('bulleted-list')}
            {/* this.renderLinkButton() */}
          </div>

          <div className="editor">
            <Editor
              placeholder={this.props.placeholder}
              plugins={plugins}
              value={this.state.value}
              onChange={this.onChange}
              onPaste={this.onPaste}
              onKeyDown={this.onKeyDown}
              renderNode={this.renderNode}
              renderMark={this.renderMark}
            />
          </div>

        </div>
        }
      </Fragment>
    );
  }
}

RichEditor.propTypes = {
  id: PropTypes.number,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  children: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  node: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  mark: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  attributes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func,
};

RichEditor.defaultProps = {
  id: undefined,
  placeholder: 'Type something...',
  initialValue: '',
  children: {},
  node: {},
  mark: {},
  attributes: [],
  onChange: () => {},
};

export default RichEditor;
