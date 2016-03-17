
(function() {
  var contentList = document.querySelector('.content-list');
  var originalImages = document.querySelectorAll('.content-item');

  var shuffledImageSources = [];

  var nextThreshold = 333 * 4;

  window.addEventListener('scroll', function() {
    if (window.scrollY > nextThreshold) {
      nextThreshold += 333;
      addImagesToBottom();
    }
  }, false);

  function addImagesToBottom() {
    var numberOfImages = Math.round(window.innerWidth / 333);

    for (var i = 0 ; i < numberOfImages; i++) {
      if (shuffledImageSources.length === 0) {
        refreshShuffledImageSources();
      }

      var imageSource = shuffledImageSources.pop();
      addImage(imageSource);
    }
  }

  function addImage(src) {
    var img = document.createElement('img');
    img.src = src;
    img.className = 'content-item';

    contentList.appendChild(img);
  }

  function refreshShuffledImageSources() {
    for (var i = 0; i < originalImages.length; i++) {
      shuffledImageSources.push(originalImages[i].src);
    }
    shuffledImageSources.sort(function() { return Math.random() - 0.5; });
  }

})();
