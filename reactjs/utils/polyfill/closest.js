// Element.closest polyfill. Based on https://github.com/readable/closest.
if (typeof window !== 'undefined') {
  (function (ElementProto) {
    ElementProto.matches = ElementProto.matches || ElementProto.msMatchesSelector;

    ElementProto.closest = ElementProto.closest || function (selector) {
        var suspect = this;

        while (suspect && suspect.nodeType === Node.ELEMENT_NODE) {
          if (suspect.matches(selector)) {
            return suspect
          }
          suspect = suspect.parentNode
        }

        return null
      };
  })(window.Element.prototype);
}
