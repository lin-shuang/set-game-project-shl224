/*
Author: Shuang Lin
Email: shl224@lehigh.edu
*/

//Client Program //////////////////////////////////////////////////////////

//variables
let imgList = [];
let cardsList = [];
let server = "cupid"; //ganymede, io, hydra, miranda, cupid
const HOST = "127.0.0.1:3001";
const URL = "http://" + HOST + "/";
let myid = -1;
let myname = "";
let cardCount = 0;
let playerCount = 0;

//start of webpage, run below function
$(document).ready(function () {

    //preload images then initialize game board
    $.ajax({
        url: '/preload',
        type: 'GET',
        success: function(returned) {
            $.ajax({
                url: '/initialize',
                type: 'GET',
                success: function(returned) {
        
                    //store all cards into array
                    imgList = returned.split("|-|"); //separator '|-|'
                }
            });
        }
    });

    //attach event handlers to buttons
    $("body").click(function(event){

        //toggle border on images
        if(event.target.classList.contains("images")){
            if(event.target.classList.contains("selected")){
                $(event.target).closest("img").css("border-color","white");
                event.target.classList.remove("selected");
            }
            else{
                $(event.target).closest("img").css("border-color","black");
                event.target.classList.add("selected");
            }
        }

        //login button
        if(event.target.id == "input_login"){
            let input = $("#input_text").val();

            //get id from input
            doAjaxCall("GET", "login", { loginName: input }, function(id) {
                //save returned login id
                myid = id;

                //get username from id
                doAjaxCall("GET", "loginname", { id: myid }, function(name) {
                    //save returned username and add to title
                    myname = name;
                    if(myname == "Error"){
                        $("#title").empty()
                        $("#title").append("Welcome to Set, Please Login"); 
                        $("#form_login")[0].reset();
                    }
                    else{
                        $("#title").empty()
                        $("#title").append("Welcome to Set, "+myname);
                        $("#form_login").empty();
                    }
                });
            });
        }

        //set button
        if(event.target.id == "set"){

            //get selected cards
            for(let i = 0; i < $(".selected").length; i++){
                cardsList[i] = $(".selected:eq("+i+")").attr("id");
            }            

            //ajax to main server
            doAjaxCall("GET", "submitset", { id: myid, cards: cardsList}, function(returned){
            });
        }

        //add row button
        if(event.target.id == "add_row"){
            doAjaxCall("GET", "addrow", { id: myid }, function(returned){
            });
        }

        //shuffle button
        if(event.target.id == "shuffle"){
            doAjaxCall("GET", "shuffle", { id: myid }, function(returned){
            });
        }

        //end game button
        if(event.target.id == "end_game"){
            doAjaxCall("GET", "endgame", { id: myid }, function(returned){
            });
        }

        //send chat button
        if(event.target.id == "chat_send"){
            let message = $("#chat_text").val();
            doAjaxCall("GET", "chat", { id: myid, message: message }, function(returned){
            });
            $("#form_chat")[0].reset();
        }
    });

    //socket connection to game server
    var socket = io.connect(HOST);
    socket.on('hand', function (cards) { loadGrid(cards);});
    socket.on('players', function (players) { loadStatus(players);});
    socket.on('chat', function (message) { displayChatMessage(message);});    
});

//Functions //////////////////////////////////////////////////////////

//empty function
function nullFcn(result) {}

//socket server's aJax caller
function doAjaxCall(method, cmd, params, fcn) {
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

function loadGrid(cards){

    //reset card count to re-update
    cardCount = 0;

    while(cardCount != cards.length){
        //reset board
        $("#div_board").empty();

        //get index from cards array then pass index to saved images list
        for(let i = 0; i < cards.length; i++){
            $("#div_board").append(imgList[cards[i]-1]);
            cardCount++;
        }
    }    
}

function loadStatus(players){

    //reset vars to re-update
    let playerHTML = "";
    playerCount = 0;

    while(playerCount != players.length){

        //set header
        playerHTML += "<tr><th>Name</th> <th>Score</th> <th>R</th> <th>S</th> <th>E</th></tr>"

        //reset score board
        $("#scores").empty();

        //increment player list
        for(let i = 0; i < players.length; i++){
            
            //check RSE status
            if(players[i].row){players[i].row = "*";}
                else{players[i].row = "";};
            if(players[i].shuffle){players[i].shuffle = "*";}
                else{players[i].shuffle = "";};
            if(players[i].end){players[i].end = "*";}
                else{players[i].end = "";};
    
            //check winner status and add player
            if(!players[i].winner){
                playerHTML += ("<tr>"+
                    "<td>"+players[i].player+"</td>"+
                    "<td>"+players[i].score+"</td>"+
                    "<td>"+players[i].row+"</td>"+
                    "<td>"+players[i].shuffle+"</td>"+
                    "<td>"+players[i].end+"</td>"+
                "</tr>");
                playerCount++;
            }
            else{
                playerHTML += ("<tr id='winner'>"+
                    "<td>"+players[i].player+"</td>"+
                    "<td>"+players[i].score+"</td>"+
                    "<td>"+players[i].row+"</td>"+
                    "<td>"+players[i].shuffle+"</td>"+
                    "<td>"+players[i].end+"</td>"+
                "</tr>");
                playerCount++;
            }
            
        }
        $("#scores").append(playerHTML);
    }
}

function displayChatMessage(message){
    $("#chat_box").append(message);
}