
var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
    var $row = $(template);
        
    var clickHandler = function() {
         // clickHandler logic
        var songNumber = parseInt($(this).attr('data-song-number'));
 

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
            
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updateSeekPercentage($('.volume .seek-bar'), currentVolume)
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
           
            if (currentSoundFile.isPaused() == true) {
              $(this).html(pauseButtonTemplate);  
              $('.main-controls .play-pause').html(playerBarPauseButton);
              currentSoundFile.play();  
              updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
                
        }

    };
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
       // console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        } 
    };
    
    $row.find('.song-item-number').click(clickHandler);
    
    $row.hover(onHover, offHover);
    
    return $row;
    
 };

    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');    

//Display the album dynamically     
  var setCurrentAlbum = function(album) {
    
     /* currentAlbum holds the album being played. */
     currentAlbum = album;
      
      // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     
     // #3
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, filterTimeCode(album.songs[i].duration));
         $albumSongList.append($newRow);
     }
 };

//Update the seekbar percentages
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;

    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         
         var seekBarFillRatio = offsetX / barWidth;
 
         ($(this).parent().attr('class') == 'seek-control') ? seek(seekBarFillRatio * currentSoundFile.getDuration()) : setVolume(seekBarFillRatio * 100);
         
         updateSeekPercentage($(this), seekBarFillRatio);
         
     });
    
     $seekBars.find('.thumb').mousedown(function(event) {
        
     var $seekBar = $(this).parent();
    
     $(document).bind('mousemove.thumb', function(event){
         var offsetX = event.pageX - $seekBar.offset().left;
         var barWidth = $seekBar.width();
         var seekBarFillRatio = offsetX / barWidth;
             
         ($seekBar.parent().attr('class') == 'seek-control') ? seek(seekBarFillRatio * currentSoundFile.getDuration()) : setVolume(seekBarFillRatio);
         
         updateSeekPercentage($seekBar, seekBarFillRatio);
     });
    
     $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
         
     });
                                        
};

/* Update the seekbar with time as the song plays */
var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
         });
     }
 };
/*  Update currentlyPlayingSongNumber 
    Update CurrentSongFromAlbum
    Update updatePlayerBarSong
    Update the song element with pause button and the previous song element with the song number
    
*/
var nextSong = function () {
    
    //This variable takes care of returning the last song of the album.
    //If the index is 0, it means the previous song was last song in the album.
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    //Get the currently playing song index. The index will range from -1 to the last song index.
    //If no song is being played or paused, the currentSongFromAlbum will be null and the trackIndex function will
    //return -1. We increment the currentSongIndex to range from 1 to (last-song-index -1)
    //The currentAlbum holds the album along with the list of songs and the currentSongFromAlbum holds the song being played.
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
        
    //If we reach the last song in the album, then wrap around to the first song.
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    
    //Play the song
    currentSoundFile.play();
    
    updateSeekBarWhileSongPlays();
    
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
    
};

var previousSong = function () {
    // Note the difference between this implementation and the one in
    // nextSong()
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    
    //Play the song
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);    
};

//Play Pause the song from the player bar.
var togglePlayFromPlayerBar = function () {
    if (currentSoundFile.isPaused() == true) {
        $(this).html(pauseButtonTemplate);  
        $playPauseButton.html(playerBarPauseButton);
        currentSoundFile.play();  
    } else {
        $(this).html(playButtonTemplate);
        $playPauseButton.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};


/* Set the currentlyPlayingSongNumber and set the currentSoundFile object */
var setSong = function (songN) {
    //If a song is playing, stop it before you can play another song.
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    
    currentlyPlayingSongNumber = parseInt(songN);
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, 
                                        {
                                         formats: [ 'mp3' ],
                                         preload: true
                                        });
    //setVolume(currentVolume);
};

/* Change the song's playback position */
var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
}

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function () {
    setTotalTimeInPlayerBar((filterTimeCode(currentSongFromAlbum.duration)));    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);    
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};
    
var setCurrentTimeInPlayerBar = function (currentTime) {
  $('.current-time').text(currentTime);    
};

var setTotalTimeInPlayerBar = function (totalTime) {
    $('.total-time').text(totalTime);
};

var filterTimeCode = function (timeInSeconds) {
    var timeNum = parseFloat(timeInSeconds);
    var displayTime = timeNum/60; 
    return displayTime.toFixed(2);
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton  = $('.main-controls .previous');
var $nextButton      = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

/***************** Default album - Picasso ***********************/
$(document).ready( function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    
    var albums = [albumPicasso, albumAdele, albumMarconi];
    var index = 1;
    
   /* Changed for jQuery Objs. */ 
    $albumImage.click(function () {
        setCurrentAlbum(albums[index]);
        index++;
        if (index == albums.length) {
            index = 0;
        }
    });

    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
    
});


