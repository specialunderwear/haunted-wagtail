import { getScreenshot } from 'screenshot';
import { muhaha } from 'sound';
import { Animator } from 'animate';

document.addEventListener('DOMContentLoaded', evt => {
  var searchInput = document.getElementsByTagName("input").namedItem("q");

  searchInput.addEventListener("keyup", evt => {

    if (evt.target.value == "666") {
      getScreenshot(document.body).then(texture => {
        var animator = new Animator(texture)
        animator.animate();
        muhaha(document);
      });
    }
  });
});
