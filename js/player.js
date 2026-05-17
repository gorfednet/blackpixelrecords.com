(function () {
  "use strict";

  var audio = document.getElementById("audio-engine");
  var btnPlay = document.getElementById("btn-play");
  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");
  var npArtist = document.getElementById("np-artist");
  var npTitle = document.getElementById("np-title");
  var timeCur = document.getElementById("time-cur");
  var timeDur = document.getElementById("time-dur");
  var progressWrap = document.getElementById("progress-wrap");
  var progressFill = document.getElementById("progress-fill");
  var progressHandle = document.getElementById("progress-handle");
  var albumArt = document.getElementById("album-art");
  var tracks = Array.prototype.slice.call(document.querySelectorAll(".track"));

  var currentIndex = -1;
  var isScrubbing = false;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) {
      return "0:00";
    }
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" + secs : secs);
  }

  function setActiveTrack(index) {
    tracks.forEach(function (track) {
      track.classList.remove("active");
    });

    currentIndex = index;
    var selected = tracks[index];
    selected.classList.add("active");
    npArtist.textContent = selected.getAttribute("data-artist") || "Unknown Artist";
    npTitle.textContent = selected.getAttribute("data-title") || "Untitled";
    audio.src = selected.getAttribute("data-src") || "";
  }

  function playTrack(index) {
    if (index < 0 || index >= tracks.length) {
      return;
    }
    setActiveTrack(index);
    audio.play().catch(function () {
      btnPlay.textContent = "Play";
    });
  }

  function updatePlayButton() {
    btnPlay.textContent = audio.paused ? "Play" : "Pause";
    if (albumArt) {
      if (audio.paused) {
        albumArt.classList.remove("playing");
      } else {
        albumArt.classList.add("playing");
      }
    }
  }

  function seekWithClientX(clientX) {
    if (!audio.duration) {
      return;
    }
    var rect = progressWrap.getBoundingClientRect();
    var percent = (clientX - rect.left) / rect.width;
    if (percent < 0) {
      percent = 0;
    }
    if (percent > 1) {
      percent = 1;
    }
    audio.currentTime = percent * audio.duration;
    setProgressVisual(percent);
  }

  function setProgressVisual(percent) {
    if (!isFinite(percent) || percent < 0) {
      percent = 0;
    }
    if (percent > 1) {
      percent = 1;
    }
    progressFill.style.width = String(percent * 100) + "%";
    progressHandle.style.left = String(percent * 100) + "%";
  }

  tracks.forEach(function (track, index) {
    track.addEventListener("click", function () {
      playTrack(index);
    });
  });

  btnPlay.addEventListener("click", function () {
    if (currentIndex === -1 && tracks.length > 0) {
      playTrack(0);
      return;
    }

    if (audio.paused) {
      audio.play().catch(function () {
        btnPlay.textContent = "Play";
      });
    } else {
      audio.pause();
    }
  });

  btnPrev.addEventListener("click", function () {
    if (tracks.length === 0) {
      return;
    }
    var nextIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    playTrack(nextIndex);
  });

  btnNext.addEventListener("click", function () {
    if (tracks.length === 0) {
      return;
    }
    var nextIndex = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
    playTrack(nextIndex);
  });

  progressWrap.addEventListener("click", function (event) {
    seekWithClientX(event.clientX);
  });

  progressWrap.addEventListener("mousedown", function (event) {
    isScrubbing = true;
    seekWithClientX(event.clientX);
  });

  document.addEventListener("mousemove", function (event) {
    if (!isScrubbing) {
      return;
    }
    seekWithClientX(event.clientX);
  });

  document.addEventListener("mouseup", function () {
    isScrubbing = false;
  });

  progressWrap.addEventListener("touchstart", function (event) {
    isScrubbing = true;
    seekWithClientX(event.touches[0].clientX);
    event.preventDefault();
  }, { passive: false });

  progressWrap.addEventListener("touchmove", function (event) {
    if (!isScrubbing) {
      return;
    }
    seekWithClientX(event.touches[0].clientX);
    event.preventDefault();
  }, { passive: false });

  document.addEventListener("touchend", function () {
    isScrubbing = false;
  });

  audio.addEventListener("timeupdate", function () {
    timeCur.textContent = formatTime(audio.currentTime);
    timeDur.textContent = formatTime(audio.duration);
    if (audio.duration) {
      setProgressVisual(audio.currentTime / audio.duration);
    } else {
      setProgressVisual(0);
    }
  });

  audio.addEventListener("play", updatePlayButton);
  audio.addEventListener("pause", updatePlayButton);

  audio.addEventListener("ended", function () {
    if (tracks.length === 0) {
      return;
    }
    var nextIndex = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
    playTrack(nextIndex);
  });

  updatePlayButton();

  // Mobile tap: toggle colour on artist cards
  document.querySelectorAll(".artist-card").forEach(function (card) {
    card.addEventListener("touchstart", function (e) {
      var alreadyTouched = card.classList.contains("touched");
      document.querySelectorAll(".artist-card.touched").forEach(function (c) {
        c.classList.remove("touched");
      });
      if (!alreadyTouched) {
        card.classList.add("touched");
        e.preventDefault();
      }
    }, { passive: false });
  });

  // Email remains hidden until explicit user interaction.
  var revealEmailButton = document.getElementById("reveal-email");
  var contactEmailLink = document.getElementById("contact-email-link");
  if (revealEmailButton && contactEmailLink) {
    revealEmailButton.addEventListener("click", function () {
      var user = "info";
      var domain = "blackpixelrecords.com";
      var address = user + "@" + domain;
      contactEmailLink.href = "mailto:" + address;
      contactEmailLink.textContent = address;
      contactEmailLink.classList.remove("is-hidden");
      revealEmailButton.classList.add("is-hidden");
    });
  }
})();
