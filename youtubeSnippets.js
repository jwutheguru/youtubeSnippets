/**
 *  YouTube Snippets
 *  =================================
 *  A personal collection of commands to modify and enhance YouTube's video player (HTML5 Video Player Only).
 *
 *  Methods:
 *      - repeat(times)         Repeat YouTube player for specified number of times 
 *                              or indefinitely.

 *      - stopRepeat            Stop YouTube player repeating.

 *      - enableTrueSize        Video will use actual video dimensions 
 *                              instead of filling the screen when in full screen mode.

 *      - disableTrueSize       Video will fill screen in full screen mode.

 *      - enableAudioOnly       Video playback is hidden (lowers GPU process and paint regions).
 *                              A static poster image of the video will be shown instead.
 *
 *      - disableAudioOnly      Restore video playback and hide static poster image.
 * 
 *  (c) 2015 J. "Eric" Wu
*/

;var youtubeSnippets = (function(window, document, undefined) {
    "use strict";

    var player = document.getElementsByTagName('video')[0];
    var playerContainer = player.parentNode;

    var youtubeRepeater; // YouTube Repeater module
    var youtubeTrueSize; // YouTube TrueSize module
    var youtubeAudioOnly; // YouTube AudioOnly module

    /**
     *  YouTube Repeater module
     *  Allows video player to repeat upon ending.
     *  @returns {object} public methods: repeat(), stopRepeat()
     */
    youtubeRepeater = (function(player) {

        var playCount = 0;

        /**
         *  Repeat the YouTube video player for specified number of times.
         *  Leave blank or 0 for always repeat.
         *  @param {number} times The number of times to repeat. Leave blank or 0 for always repeat.
         */
        function repeat(times) {
            times = !!parseInt(times) ? parseInt(times) : 0;

            stopRepeat();

            player.addEventListener('ended', function(e) {
                playCount++;

                if (times && playCount > times) {
                    stopRepeat();
                    return;
                }

                this.currentTime = 0;
                this.play();
            });

            if (player.ended) {
                player.currentTime = 0;
                player.play();
            }
        }

        /**
         *  Ends YouTube player video repeating.
         */
        function stopRepeat() {
            playCount = 0;
            player.removeEventListener('ended');
        }

        return {
            repeat: repeat,
            stopRepeat: stopRepeat
        };

    })(player);

    /**
     *  YouTube TrueSize module
     *  In full screen mode, video will play at actual video dimensions instead of scaling to fill the screen. 
     *  No change if video is at or greater than screen dimensions.
     *  @returns {object} public methods: enable(), disable()
     */
    youtubeTrueSize = (function(player) {

        var pluginEnabled = false;
        var currentPlayerQuality = 0; // initially 0 so function will run once when enabled
        
        /**
         *  Set YouTube player to literal size of video dimension and centers on screen.
         */
        function centerNonscaledPlayer() {
            if (player.videoHeight == currentPlayerQuality) return; // if quality didn't change, do nothing
                
            currentPlayerQuality = player.videoHeight;
            
            if (!playerContainer.offsetWidth > player.videoWidth || !playerContainer.offsetHeight > player.videoHeight)
                return;
            
            player.style.position = 'absolute';
            player.style.top = 'calc(50% - ' + player.videoHeight / 2 + 'px)';
            player.style.left = 'calc(50% - ' + player.videoWidth / 2 + 'px)';
            player.style.height = player.videoHeight +'px';
            player.style.width = player.videoWidth +'px';
        }
        
        /**
         *  Revert the YouTube player to full dimensions.
         */
        function revertCenterNonscaledPlayer() {
            currentPlayerQuality = 0;
            
            player.style.position = '';
            player.style.top = '';
            player.style.left = '';
            player.style.height = '';
            player.style.width = '';
        }
        
        /**
         *  On enter or leave full screen, handle TrueSize functions
         */
        function videoFullscreenEvent() {
            if (document.webkitIsFullScreen) {
                centerNonscaledPlayer();
                player.addEventListener('timeupdate', centerNonscaledPlayer);
            }
            else {
                revertCenterNonscaledPlayer();
                player.removeEventListener('timeupdate', centerNonscaledPlayer);
            }
        }
        
        /**
         *  Enables TrueSize plugin and allow video to use actual video dimensions in full screen mode instead of filling the screen.
         */
        function enablePlugin() {
            if (pluginEnabled) return;
            
            pluginEnabled = true;
            
            document.addEventListener('webkitfullscreenchange', videoFullscreenEvent);
            videoFullscreenEvent(); // run once (in case user enable plugin when full screen)
        }
        
        /**
         *  Disables TrueSize plugin and resume normal playback.
         */
        function disablePlugin() {
            if (!pluginEnabled) return;
            
            pluginEnabled = false;
            
            revertCenterNonscaledPlayer();
            player.removeEventListener('timeupdate', centerNonscaledPlayer);
            document.removeEventListener('webkitfullscreenchange', videoFullscreenEvent);
        }
        
        return {
            enable: enablePlugin,
            disable: disablePlugin
        };

    })(player);

    /**
     *  YouTube AudioOnly module
     *  Hides video playback (lowers GPU process and paint regions), 
     *  although data sent through Network is still video format.
     *  A static poster image is shown instead.
     *  @returns {object} public methods: enable(), disable()
     */
    youtubeAudioOnly = (function(player) {

        var pluginEnabled = false;

        var videoId;
        var posterImageUrl;
        var posterImageElement;
        var audioOnlyLabel;

        /**
         *  Enable AudioOnly mode and hide video playback and show poster image.
         */
        function enable() {
            if (pluginEnabled) 
                return;

            if (!videoId) videoId = document.querySelector('meta[itemprop="videoId"]').getAttribute('content');
            if (!posterImageUrl) posterImageUrl = '//img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';

            if (!posterImageElement && !audioOnlyLabel)
                createElements();
            else {
                posterImageElement.style.display = 'block';
                audioOnlyLabel.style.display = 'block';
            }

            player.style.display = 'none';

            pluginEnabled = true;
        }

        /**
         *  Creates the poster image and label elements if not already created.
         */
        function createElements() {
            posterImageElement = document.createElement('img');
            audioOnlyLabel = document.createElement('label');

            posterImageElement.style.width = '100%';
            posterImageElement.style.height = 'auto';
            posterImageElement.src = posterImageUrl;
             
            audioOnlyLabel.style.position = 'absolute';
            audioOnlyLabel.style.bottom = '10%';
            audioOnlyLabel.style.width = '100%';
            audioOnlyLabel.style.padding = '20px 30px';
            audioOnlyLabel.style.color = '#fff';
            audioOnlyLabel.style.fontSize = '2.5em';
            audioOnlyLabel.style.fontWeight = 'bold';
            audioOnlyLabel.style.textAlign = 'center';
            audioOnlyLabel.style.textShadow = '0 0 0.25em #000';
            audioOnlyLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            audioOnlyLabel.style.boxSizing = 'border-box';
            audioOnlyLabel.innerHTML = 'Audio Only';

            player.parentNode.insertBefore(posterImageElement, player.nextSibling);
            player.parentNode.insertBefore(audioOnlyLabel, player.nextSibling);
        }

        /**
         *  Disable AudioOnly mode and resume normal video playback.
         */
        function disable() {
            if (!pluginEnabled)
                return;

            player.style.display = '';
            posterImageElement.style.display = 'none';
            audioOnlyLabel.style.display = 'none';

            pluginEnabled = false;
        }

        return {
            enable: enable,
            disable: disable
        };

    })(player);


    // youtubeSnippets public methods
    return {
        repeat: youtubeRepeater.repeat,
        stopRepeat: youtubeRepeater.stopRepeat,
        enableTrueSize: youtubeTrueSize.enable,
        disableTrueSize: youtubeTrueSize.disable,
        enableAudioOnly: youtubeAudioOnly.enable,
        disableAudioOnly: youtubeAudioOnly.disable
    };

})(window, document);
