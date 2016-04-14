
(function atsea() {

  images();

  function images() {
    var contentList = document.querySelector('.content-list');
    var originalImages = document.querySelectorAll('.content-item');

    var shuffledImageSources = [];

    var rowsToAddAtOnce = 8;
    var rowHeight = 333;
    var nextThreshold = rowHeight * rowsToAddAtOnce;

    window.addEventListener('scroll', function() {
      console.log('scrolllll');
      if (window.scrollY > nextThreshold) {
        nextThreshold += (rowHeight * rowsToAddAtOnce);
        addImagesToBottom();
      }
    }, false);

    function addImagesToBottom() {
      var numberOfImages = rowsToAddAtOnce * Math.round(window.innerWidth / 333);

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

    function scrollDown() {
      window.scrollBy(0, 1);
    }

    setTimeout(function() {
      setInterval(scrollDown, 30);
    }, 3000);
  }

})();
