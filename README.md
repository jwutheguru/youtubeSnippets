# Youtube Snippets

A personal collection of commands to modify and enhance YouTube's video player.

## Usage

Unfortunately YouTube Snippets is not a browser plugin yet. So to use, you'll have to paste the entirety of the code to your browser console (general F12). Then to use, call "youtubeSnippets" then "." (dot), then the name of the method:

    youtubeSnippets.repeat();

## Methods

 - repeat(times) - Repeat YouTube player for specified number of times or indefinitely.
 - stopRepeat() - Stop YouTube player repeating.
 - enableTrueSize() - Video will use actual video dimensions instead of filling the screen when in full screen mode.
 - disableTrueSize() - Video will fill screen in full screen mode.
 - enableAudioOnly() - Video playback is hidden (lowers GPU process and paint regions). A static poster image of the video will be shown instead.
 - disableAudioOnly() - Restore video playback and hide static poster image.
