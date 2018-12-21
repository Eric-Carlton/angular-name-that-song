# AngularNameThatSong

## Description

This is an application to simplify moderating a game of Name That Song that I hacked together in a weekend.

The game is simple - a preview of a song is played and players may guess the name and artist of the song. A correct guess is awarded one point, while an incorrect guess comes with a penalty of one point. Players may abstain from answering to prevent losing a point. Correctness / incorrectness is determined by the moderator. The game is over when a player reaches 5 points with a 2 point lead.

This application gives the ability to enter the names of all players, select up to five artists as playlist seeds, preview and remove songs from the playlist, play song previews, score players, and open a link to the full song on Spotify.

## Requirements

* [NodeJS](https://nodejs.org/en/download/) v8+ 
    - Originally built with v11.4.0, but should be compatible with as low as  v8

## Setup

1. Ensure [NodeJS](https://nodejs.org/en/download/) 8+ is installed.
2. Clone or download the repository
3. Run `npm install` to download required dependencies from npm
4. Add Spotify API client ID and client secret
    1. [Register an application with Spotify](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app)
    2. Get your client ID and client secret
    3. Create a `private.conf.js` file at `src/node/conf`. 
    4. Export your client ID and client secret from  `private.conf.js` in the following format: 
    ```
    module.exports = {
        spotify: {
            clientId: 'your-client-id-here',
            clientSecret: 'your-client-secret-here'
        }
    }
    ```
5. Run `npm start` to build the angular applicaton and start the server
6. The application can be accessed at http://localhost:3000

## Usage

### Add Players

![Add Players Page](screenshots/add-players-page.png?raw=true)

Add players by typing the player's name in the text input and clicking the "Add" button.

Players can be removed by clicking the "Remove" button in the same row as their name.

When all players have been added, click "Finished Adding Players" to continue to playlist generation.

### Create Playlist

![Create Playlist Page](screenshots/create-playlist-page.png?raw=true)

Provide up to 5 seed artists in the text input. Separate each artist with a comma. Click "Create Playlist" to query Spotify for recommendations based on that artist(s).

You can remove individual songs by clicking the "Remove" button in the same row as the song's name. 

You can generate an entirely new playlist by providing a different set of artists and clicking "Create Playlist" again.

When you are happy with your playlist, click "Continue with this Playlist" to move on to the game screen.

### Play Game

![Play Game Page Before Start](screenshots/play-game-page-before-start.png?raw=true)

Click "Start Game" in the Now Playing section to begin the game. The first song preview will start playing immediately after this button is clicked.

![Play Game Page After Start](screenshots/play-game-page-after-start.png?raw=true)

Once the game has been started, the Now Playing section shows: 

* The current song's title and artist ( separated by a "-" )
    * Clicking on this will pause the song and open a new tab to the Spotify page for the current song
* The name of the album that the current song appears on
* Album art
* A pause / play / replay button. The text in this button will update based on the current song's state
* A "Next Song!" button. Pressing this will progress to the next song and its preview will immediately begin playing

The Scoring section shows a table with

* Each player's name
* Each player's current score
* A button to increment each player's score 1 point
* A button to decrement each player's score 1 point

Once a player has reached at least five points with a two point lead, a dialog declaring the winner will be displayed.

![Play Game Page Winner Dialog](screenshots/play-game-page-winner-dialog.png?raw=true)

Clicking "New Game" here will take you back to the Add Players page, resetting players, scores, and the playlist.

If the playlist is exhausted, a dialog will be displayed asking if you'd like to create a new playlist or declare a winner.

![Play Game Page Playlist Exhausted](screenshots/play-game-page-playlist-exhausted.png?raw=true)

Clicking "No, declare winner" will declare the player ( or players, in case of a tie ) with the highest score as the winner. 

Clicking "Yes" will take you back to the Create Playlist page and allow you to create a new playlist and continue the current game - preserving current players and scores.

### Issues / Bugs / Etc.

Feel free to report any bugs or feature requests by opening an issue [here](https://github.com/Eric-Carlton/angular-name-that-song/issues/new).

If you have any feature requests, feel free to open an issue. However, I can't guarantee I'll implement all requested features since I really just hacked this together as a game to play with my friends. If you feel very strongly about adding a feature, the fastest way to get it in would be to open an issue and the submit a pull request which resolves the issue.