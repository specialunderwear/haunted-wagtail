export function muhaha(doc) {

  var audio = document.createElement('audio');
  audio.setAttribute("src","/static/haunted/haunted.wav");
  audio.setAttribute("loop", "false");

  doc.body.appendChild(audio).play();
}
