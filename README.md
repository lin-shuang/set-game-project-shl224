# Homework 7 - Set Game Project

- Author: Shuang Lin
- Email: shuanglin3359@gmail.com

### CSE 264 – Web Systems Programming, Fall 2022

### Description
The completed project will implement a web application for playing the Set card game with multiple players over a network.

### Instructions

- Get node_modules from package.json
      
1. In the repo working folder:
  Run npm init. Use the defaults except for:
    1. package name: Set
    2. description:: Set Game Client
    3. entry point: SetGameClient.js
    4. author: enter your name and email, eg. James Femister <jaf207@lehigh.edu>
       
       Edit package.json with VSC and in the scripts section replace
       "test": "echo \"Error: no test specified\" && exit 1"
       with
       "start": "node SetGameClient.js" 
       
2. Install **express** using the --save option. 
3. Create files to hold the css and js and put them in the public folder along with the index.html file. Put all your css and js in these files.
4. Make sure you have a comment in each file with your name, etc.
5. The SetGameClient.js script provided with the initial repo is set up to load these files from the public folder when requested.
6. Commit with a comment of "Initial commit" and push to github.
7. The basic structure of the application will be a single html page that uses Ajax calls and web sockets (using the socket.io library) to communicate with the server.
8. Unzip the images.zip file and place the images in a separate images folder within the public folder. Each Set card will now be designated by an integer from 1 to 81.
9. Layout the display page to look something like the screen shot included with this folder.
11. The display page js should pre-load all the images from the images directory and store each one as an element in an array to be used later. The index on the array must be the number of the image file. Use callbacks and promises to preload the images and wait until the images are loaded before continuing.
12. Create a JavaScript function that takes an array of integers as a parameter and displays corresponding hand of cards (x rows of 3 across) on the page. The list of cards is an array of integers, since each card is known by its own integer. To test this function, hard code an array of 12 integers and call the function.
13. Commit and push to git.
14. Implement an event handler on each image in the grid to surround the image with a border when it is clicked. Toggle this border each time the image is clicked.
15. Create an empty function in your script: function nullFcn(result) { }
16. Add the following javascript function to your script:
    <pre><code>
    const URL = "";
    function doAjaxCall(method,  cmd, params, fcn) {
      $.ajax(
        URL + cmd,
        {
          type: method,
          processData: true,
          data: params,
          dataType: "jsonp",
          success: function (result) {  fcn(result) },
          error: function (jqXHR, textStatus, errorThrown) {
            alert("Error: " + jqXHR.responseText);
            alert("Error: " + textStatus);
            alert("Error: " + errorThrown);
          }
        }
      );
    }
    </code></pre>
           
Where 
**method** is the http method to be used in the call,
**cmd** is the command/service we are calling on the node server,
**params** is the JavaScript object holding the parameters for the Ajax call,
**fcn** is the one parameter function to be called on successful completion. This function will be called by the event handler for each of the buttons below. For example, the call for the Add Row button would look like this: doAjaxCall("GET", "addrow", { id: myid }, nullFcn);
17. Several steps back you placed the four command buttons and a login on the page; now you'll need to add the following functionality to these buttons using the doAjaxCall function:
  (a) Login Button:
      i. Make an Ajax call to the server to the login service and pass the entered login name as the loginName parameter. The server will login the user and return an integer id. Save this is in a variable. It should then call another function to do an Ajax call to retrieve the user name from the server and display it on the screen (Method = GET, Command = loginname, Parameters =id, Function = /* Save returned login name on screen */).
  (b) Set Button:
      i. Method = GET, Command = submitset, Parameters =id and cardlist, Function = nullFcn
  (c)	Add Row:
      i. Method = GET, Command = addrow, Parameters = id, Function = nullFcn
  (d) Shuffle:
      i. Method = GET, Command = shuffle, Parameters = id, Function = nullFcn
  (e) End Game:
      i. Method = GET, Command = endgame, Parameters = id, Function = nullFcn
  (f) Send Chat:
      i. Method = GET, Command = endgame, Parameters = id and message, Function = nullFcn
18. In your document ready function, call functions to:
20. (a) pre-load the images (described above)
    (b) attach all the event handlers to the buttons
    (c) execute the following code:

    var socket = io.connect(HOST);
    socket.on('hand', function (cards) { loadGrid(cards); });
    socket.on('players', function (players) { loadStatus(players); });
    socket.on('chat', function (message) { displayChatMessage(message);});    

where **loadGrid** is the function you've already written to load the grid of cards and **loadStatus** takes an array of players (as defined in the server code) and displays their info in the player table (leader board) on the right side of the page. Put a * in the row/col if the value is true (for row, shuffle, end) and a blank otherwise. The player property names are:
    player (string)
    score (number)
    row (boolean)
    shuffle (boolean)
    end (boolean)
    winner (boolean)
The function **displayChatMessage** will append the chat message to the scrolling list of chat messages along with the players name.
This will set up the socket.io event handlers for your page to receive and display the card and player lists from the server. The players should be listed in reverse order of their score (high score first). If any player has the winner field set then set the background color for that row to gold.
    
Use npm start to fire up the client and localhost:3001 to load the page.

21. Commit and push to git.
