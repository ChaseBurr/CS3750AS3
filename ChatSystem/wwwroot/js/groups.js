"use strict";

// build connection
var connection = new signalR.HubConnectionBuilder().withUrl("/GroupHub").build();

connection.start().then(function () {
    console.log('Connected.');
}).catch(function (err) {
    return console.error(err.toString());
});

// Variables
var username = "";
var GroupList = [];
// end of brad stuff



//--// On connection functions //--//

connection.on("UpdateGroups", (groups) => {
    groups.forEach(element => GroupList.push(groups));
    console.log('Group list Updated');
});

//--// End of connection functions //--//



//--// Event listeners //--//

// shows 'add group' button and input
document.getElementById("ShowGroupInput").addEventListener("click", function (event) {
    document.getElementById('AddCardButton').style.display = 'inline-block';
    document.getElementById('GroupName').style.display = 'inline-block';
    document.getElementById('AddGroup').style.display = 'inline-block';
    document.getElementById('Cancel').style.display = 'inline-block';
    document.getElementById('ShowGroupInput').style.display = 'none';
    event.preventDefault();
});

// Login event
document.getElementById("username_submit").addEventListener("click", function (event) {
    var user = document.getElementById("username").value;

    if (user === "") {
        alert("Please provide a username");
    } else {

        document.getElementById("loginscreen").style.display = "none";
        document.getElementById('group_list').style.display = 'inline-block';
        document.getElementById('ShowGroupInput').style.display = 'block';

        connection.invoke("addUser", user).catch(function (err) {
            return console.error(err.toString());
        });

        console.log('User Added.');
    }
    event.preventDefault();
}); 

// create group event
document.getElementById('AddGroup').addEventListener('click', function (event) {
    var input = document.getElementById('GroupName').value;

    if (input == '') {
        alert('Add Group Name or click cancel');
    } else {
        addGroup(input);

        // invoke addGroup function
        connection.invoke("addGroup", input).catch(function (err) {
            return console.error(err.toString());
        });

        console.log('Group Added.');

        document.getElementById('AddGroup').style.display = 'none'
        document.getElementById('Cancel').style.display = 'none';
        document.getElementById('GroupName').style.display = 'none';
        document.getElementById('ShowGroupInput').style.display = 'inline-block';
    }

    event.preventDefault();
});

function addGroup(groupName) {
    var GroupList = document.getElementById('group_list');
    var option = document.createElement('option');
    option.text = groupName;
    GroupList.add(option);
}

connection.on("addGroup", function (groupName) {
    addGroup(groupName);
});

// Add card event
document.getElementById('AddCardButton').addEventListener('click', (e) => {
    let groupList = document.getElementById("group_list")
    let selectedGroup = groupList.options[groupList.selectedIndex].value;
    console.log(selectedGroup);
    connection.invoke("addCard", selectedGroup, "testTitle", "testContent").catch(function (err) {
        return console.error(err.toString());
    });
});

document.getElementById('cards').addEventListener('click', function (event) {
    document.getElementById('cards').style.display = 'block';
});

connection.on("addCard", function (card) {
    //let newCard = JSON.parse(card);
    console.log(card);
});

// Cancel group event
document.getElementById('Cancel').addEventListener('click', function (event) {
    document.getElementById('AddGroup').style.display = 'none'
    document.getElementById('Cancel').style.display = 'none';
    document.getElementById('GroupName').style.display = 'none';
    document.getElementById('ShowGroupInput').style.display = 'inline-block';
});

//--// End of event listeners //--//


