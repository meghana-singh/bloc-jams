
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
            //currentlyPlayingSongNumber = songNumber;
            //currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            
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

        if (songNumber != currentlyPlayingSongNumber) {
                  
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
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

/*  Update currentlyPlayingSongNumber 
    Update CurrentSongFromAlbum
    Update updatePlayerBarSong
    Update the song element with pause button and the previous song element with the song number
    
*/

var nextSong = function () {
    var next;
    
    $(this).hasClass('next') === true ? next = 1 : next = 0;
    
    //This variable takes care of returning the last song of the album.
    //If the index is 0, it means the previous song was last song in the album.
    var getLastSongNumber = function(index) {
        if (next == 1) {
          return index == 0 ? currentAlbum.songs.length : index;
        } else {
           return index == (currentAlbum.songs.length - 1) ? 1 : index + 2; 
        }
    };
    
    //Get the currently playing song index. The index will range from -1 to the last song index.
    //If no song is being played or paused, the currentSongFromAlbum will be null and the trackIndex function will
    //return -1. We increment the currentSongIndex to range from 1 to (last-song-index -1)
    //The currentAlbum holds the album along with the list of songs and the currentSongFromAlbum holds the song being played.
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    next == 1 ? currentSongIndex++ : currentSongIndex--;
        
    //If we reach the last song in the album, then wrap around to the first song.
    if (next == 1) {
        if (currentSongIndex >= currentAlbum.songs.length) {
            currentSongIndex = 0;
        }
    } else {
        if (currentSongIndex < 0) {
            currentSongIndex = currentAlbum.songs.length - 1;
        }
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber      = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
    
};

var setSong = function (songN) {
    currentlyPlayingSongNumber = parseInt(songN);
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function () {
        
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);    
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};
    
// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

/***************** Default album - Picasso ***********************/
$(document).ready( function() {
    setCurrentAlbum(albumPicasso);
      
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
    
    //Same Click Handler for next & previous button.
    $previousButton.click(nextSong);
    $nextButton.click(nextSong);
    
});


