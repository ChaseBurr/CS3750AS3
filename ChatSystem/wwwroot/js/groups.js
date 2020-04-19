"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/GroupHub").build();
connection.start();
var username = "";

connection.on("sendstuff_raw_text", function (paramData) {
    alert("sendstuff_raw_text - paramData is: " + paramData);
});

connection.on("sendstuff_1", function (jsonObject) {
    alert("sendstuff_1 - paramData is: " + JSON.stringify(jsonObject));  
});


connection.on("sendstuff_2", function (jsonObject) {
    alert("sendstuff_2 - paramData is: " + JSON.stringify(jsonObject));  
});

document.getElementById("username_submit").addEventListener("click", function (event) {
    var user = document.getElementById("username").value;
    if (user === "") {
        alert("Please provide a username");
    } else {
        connection.invoke("Login", user).catch(function (err) {
            return console.error(err.toString());
        });
    }
    event.preventDefault();
});


//Disable send button until connection is established
//document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

//connection.start().then(function () {
//    document.getElementById("sendButton").disabled = false;
//}).catch(function (err) {
//    return console.error(err.toString());
//});
