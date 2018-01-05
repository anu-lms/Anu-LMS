import React from 'react';

class YandexMetrika extends React.Component{
  // React on page change event.
  componentDidMount(){
    window[`yaCounter${this.props.analyticId}`].hit(window.location.pathname + window.location.search)
  }

  render() {
    return (
      <div>
        <script
          dangerouslySetInnerHTML={{__html: `(function (d, w, c) { (w[c] = w[c] || []).push(function()
          { try { w.yaCounter${this.props.analyticId} = new Ya.Metrika({ id:${this.props.analyticId}, clickmap:true, trackLinks:true,
          accurateTrackBounce:true, trackHash:true }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0],
          s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript";
          s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]")
          { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");` }}
          type="text/javascript"
        />
        <noscript dangerouslySetInnerHTML={{__html: `<div><img src="https://mc.yandex.ru/watch/${this.props.analyticId}" style="position:absolute; left:-9999px;" alt="" /></div>`}} />
      </div>
    )
  }
}

export default YandexMetrika;
