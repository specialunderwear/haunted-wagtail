export function muhaha(doc) {

  var markup = `<embed src="/static/haunted/muhaha.wav"
  autostart="true" hidden="false" loop="false">
  <noembed>
    <bgsound src="/static/haunted/muhaha.wav" loop="1" >
    </bgsound>
  </noembed>
  </embed>`;

  var audio = document.createElement('audio');
  audio.setAttribute("src","/static/haunted/muhaha.wav");
  audio.setAttribute("loop", "false");

  doc.body.appendChild(audio).play();
}
