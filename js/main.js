
(function images() {
  var contentList = document.querySelector('.content-list');
  var originalImages = document.querySelectorAll('.content-item');

  var shuffledImageSources = [];

  var rowsToAddAtOnce = 8;
  var rowHeight = 333;
  var nextThreshold = rowHeight * rowsToAddAtOnce;

  window.addEventListener('scroll', function() {
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

  setTimeout(function() {
    if (!activeAudioElement && !isOnMobileBrowser()) {
      activateFirstTrack();
    }
  }, 3500);

  playPauseEl.onclick = function() {
    if (!activeAudioElement) {
      activateFirstTrack();
      return;
    }

    if (activeAudioElement.paused) {
      activeAudioElement.play();
      playPauseEl.textContent = 'Pause';
    }
    else {
      activeAudioElement.pause();
      playPauseEl.textContent = 'Play';
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
    audio.src = 'media/tracks/' + trackName + '.mp3';
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
      trackTimeEl.textContent = current + '/' + duration;
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
    currentTrackEl.textContent = simpleName;

    trackNumberEl.textContent = (trackIndex + 1) + '/' + trackNames.length;

    playPauseEl.textContent = 'Pause';
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

function isOnMobileBrowser() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
