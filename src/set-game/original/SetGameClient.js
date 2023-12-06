/*
Author: Shuang Lin
Email: shl224@lehigh.edu
*/

//Local Server Program //////////////////////////////////////////////////////////

//set public path
const path = require("path");
let publicPath = path.resolve(__dirname, "public");

//initialize express server client
const express = require("express");
const { exit } = require("process");
const { Server } = require("http");
let app = express();
app.use(express.static(publicPath));
app.listen(3001, () => console.log("Starting up Set Game Client"));


//global vars
class Image{
    constructor(id, imgPath){
        this.id = id;
        this.imgPath = imgPath;
    }
}
let imgList = [];
let returnHTML = ""; //HTML string to return to client

//Routers //////////////////////////////////////////////////////////

//Route preload
app.get('/preload', function (req, res) {

    //preload using callback to promise
    let loading = new Promise((resolve, reject) => {

        const fs = require("fs");
        
        //check if image file exist
        fs.access(publicPath+"/images/01.gif", fs.constants.R_OK, (error) => {
            if(error){
                reject("ERROR");
            }
            else{
                resolve("SUCCESS");

            }
        });
    });

    //awaiting promise
    loading.then(
        function(res){
            //success, 
            preloadImages();
        },
        function(error){console.log("Error, no image files.");}
    );

    //send to browser's ajax success call
    res.end();
});

//Route initialize
app.get('/initialize', function (req, res) {

    //turn list into html to return
    buildHTML();

    //send to browser's ajax success call
    res.end(returnHTML);
});

//Functions //////////////////////////////////////////////////////////

function preloadImages(){

    //load images 1 to 81 into imgList
    for(let i=1; i<=81; i++){
            
        //get path
        let imgPath = i+".gif";
        if(i < 10){
            imgPath = '0'+imgPath;
        }
        imgPath = "/images/"+imgPath;

        //create obj and add to list
        imgList[i] = new Image(
            i,
            imgPath
        );
    }
}

function buildHTML(){

    //empty then rebuild board of size 12
    returnHTML = "";
    for(let i = 1; i <= 81; i++){
        if(imgList[i].imgPath){ //ignores any empty words
            returnHTML += ("<img " +
            "src="+imgList[i].imgPath+" " +
            "class='images' " +
            "id='"+i +
            "'>" +
            "</img>" +
            "|-|"); //separator '|-|'
        }
    }
    return returnHTML;
}