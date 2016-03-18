
(function images() {
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

(function audio() {
  var trackNames = [
    'Mister_Shane__At_Sea__01_Fantasy',
    'Mister_Shane__At_Sea__02_(interlude)',
    'Mister_Shane__At_Sea__03_Ecstasy',
    'Mister_Shane__At_Sea__04_(interlude)',
    'Mister_Shane__At_Sea__05_Sensation',
    'Mister_Shane__At_Sea__06_(interlude)',
    'Mister_Shane__At_Sea__07_Fascination',
    'Mister_Shane__At_Sea__08_(interlude)',
    'Mister_Shane__At_Sea__09_Imagination',
    'Mister_Shane__At_Sea__10_(interlude)',
    'Mister_Shane__At_Sea__11_Inspiration',
    'Mister_Shane__At_Sea__12_(interlude)',
    'Mister_Shane__At_Sea__13_Elation',
    'Mister_Shane__At_Sea__14_(interlude)',
    'Mister_Shane__At_Sea__15_Paradise'
  ];

  var audioElements = {};
  audioElements[trackNames[0]] = makeAudioElement(trackNames[0], true);
  audioElements[trackNames[1]] = makeAudioElement(trackNames[1], true);

  var activeAudioElement = null;
  var currentTrackIndex = 0;

  var playPauseEl = document.querySelector('#play-pause-button');
  var currentTrackEl = document.querySelector('#current-track-title');
  var prevTrackEl = document.querySelector('#prev-track-button');
  var nextTrackEl = document.querySelector('#next-track-button');
  var trackTimeEl = document.querySelector('.track-time');
  var trackNumberEl = document.querySelector('.track-number');

  playPauseEl.onclick = function() {
    if (!activeAudioElement) {
      activateFirstTrack();
      return;
    }

    if (activeAudioElement.paused) {
      activeAudioElement.play();
      playPauseEl.innerText = 'Pause';
    }
    else {
      activeAudioElement.pause();
      playPauseEl.innerText = 'Play';
    }
  };

  prevTrackEl.onclick = function() {
    goToPrevTrack();
  };

  nextTrackEl.onclick = function() {
    goToNextTrack();
  };

  function makeAudioElement(trackName, preload) {
    var audio = document.createElement('audio');
    audio.src = '/media/tracks/' + trackName + '.mp3';
    audio.preload = preload ? true : false; // to get around undefined, I'm not dumb

    return audio;
  }

  function activateFirstTrack() {
    updateWithTrackIndex(currentTrackIndex);

    playPauseEl.classList.remove('big-font');
    prevTrackEl.classList.remove('transparent');
    nextTrackEl.classList.remove('transparent');

    function updateCurrentTime() {
      if (!activeAudioElement) {
        return;
      }

      var current = secondsToMinutesSeconds(activeAudioElement.currentTime);
      var duration = secondsToMinutesSeconds(activeAudioElement.duration);
      trackTimeEl.innerText = current + '/' + duration;
    }

    updateCurrentTime();
    setInterval(updateCurrentTime, 250);
  }

  function secondsToMinutesSeconds(s) {
    var seconds = Math.floor(s) % 60;
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    var minutes = Math.floor((s / 60) % 60);

    return minutes + ':' + seconds;
  }

  function goToNextTrack() {
    if (!activeAudioElement) return;

    currentTrackIndex = nextIndexFromIndex(currentTrackIndex);

    var nextTrackIndex = nextIndexFromIndex(currentTrackIndex);
    getAudioElement(nextTrackIndex).preload = true;

    updateWithTrackIndex(currentTrackIndex);
  }

  function goToPrevTrack() {
    if (!activeAudioElement) return;

    currentTrackIndex = prevIndexFromIndex(currentTrackIndex);

    var prevTrackIndex = prevIndexFromIndex(currentTrackIndex);
    getAudioElement(prevTrackIndex).preload = true;

    updateWithTrackIndex(currentTrackIndex);
  }

  function updateWithTrackIndex(trackIndex) {
    if (activeAudioElement) {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
      activeAudioElement.onended = null;
    }

    activeAudioElement = getAudioElement(trackIndex);
    activeAudioElement.play();
    activeAudioElement.onended = function() {
      goToNextTrack();
    };

    var trackName = trackNames[trackIndex];
    var simpleName = trackName.substring(trackName.lastIndexOf('_') + 1);
    currentTrackEl.innerText = simpleName;

    trackNumberEl.innerText = (trackIndex + 1) + '/' + trackNames.length;

    playPauseEl.innerText = 'Pause';
  }

  function getAudioElement(trackIndex) {
    var trackName = trackNames[trackIndex];

    var element = audioElements[trackName];
    if (element) {
      return element;
    }

    element = makeAudioElement(trackName, false);
    audioElements[trackName] = element;
    return element;
  }

  function nextIndexFromIndex(index) {
    return index === trackNames.length - 1 ? 0 : index + 1;
  }

  function prevIndexFromIndex(index) {
    return index === 0 ? trackNames.length - 1 : index - 1;
  }

})();
