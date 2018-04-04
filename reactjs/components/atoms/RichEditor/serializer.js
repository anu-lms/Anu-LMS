import Html from "skorzh-slate-html-serializer";
//import Html from "../../../vendor/slate-html-serializer";

const BLOCK_TAGS = {
  p: 'paragraph',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  li: 'list-item',
};

const INLINE_TAGS = {
  a: 'link'
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underlined',
};

const rules = [
  {
    deserialize: function(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (!type) { return; }
      return {
        object: 'block',
        type: type,
        nodes: next(el.childNodes)
      };
    },
    serialize: function(object, children) {
      if (object.object !== 'block') { return; }
      switch (object.type) {
        case 'numbered-list':
          return <ol>{children}</ol>;
        case 'bulleted-list':
          return <ul>{children}</ul>;
        case 'list-item':
          return <li>{children}</li>;
        case 'paragraph':
          return <p>{children}</p>;
        case 'link':
          return <a>{children}</a>;
      }
    }
  },
  // Add a new rule that handles marks...
  {
    deserialize: function(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (!type) { return; }
      return {
        object: 'mark',
        type: type,
        nodes: next(el.childNodes)
      };
    },
    serialize: function(object, children) {
      if (object.object !== 'mark') { return; }
      switch (object.type) {
        case 'bold':
          return <strong>{children}</strong>;
        case 'italic':
          return <em>{children}</em>;
        case 'underlined':
          return <u>{children}</u>;
      }
    }
  },
  {
    deserialize: function (el, next) {
      if (el.tagName !== 'a') { return; }
      const type = INLINE_TAGS[el.tagName.toLowerCase()];

      if (!type) {
        return;
      }
      return {
        object: 'inline',
        type: type,
        nodes: next(el.childNodes),
        data: {
          href: el.attrs.find(({name}) => name === 'href').value
        }
      };
    },
    serialize: function (object, children) {
      if (object.object !== 'inline') {
        return;
      }
      switch (object.type) {
        case 'link':
          return <a href={object.data.get('href')}>{children}</a>;
      }
    }
  },
];

export const html = new Html({ rules });
