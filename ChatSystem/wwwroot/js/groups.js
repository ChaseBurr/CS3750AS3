"use strict";

// build connection
let connection = new signalR.HubConnectionBuilder().withUrl("/GroupHub").build();

connection.start().then(function () {
    console.log('Connected.');
}).catch(function (err) {
    return console.error(err.toString());
});

// letiables
let username = "";
let title = "";
let content = "";
let GroupList = [];
let groupdata = {};
let users = {};


//--// On connection functions //--//

connection.on("addUser", (newUser) => users.add(newUser));

connection.on("UpdateGroups", (groups) => {
    groups.forEach(element => GroupList.push(groups));
    console.log('Group list Updated');
});

// asyncronously adds group to selection list from other user
connection.on("addGroup", function (newGroupsJson) {
    // json array of group names
    let newGroups = JSON.parse(newGroupsJson);
    console.log(newGroups);
    newGroups.forEach(group => addGroup(group.name));
});

connection.on("addCard", function (card, groupName) {
    console.log('Updated Cards');
    let newCard = JSON.parse(card);
    UpdateCardHTML(newCard, groupName)
    //CreateCardHTML(groupName);
    console.log(newCard);
});

connection.on("revealCards", (groups) => {
    // updates new user with groups and cards
    console.log('revealed cards');
    groupdata = JSON.parse(groups);
    groupdata.forEach(group => addGroup(group.name));
});

//--// End of connection functions //--//



//--// Event listeners //--//

// shows 'add group' button and input
document.getElementById("ShowGroupInput").addEventListener("click", function (event) {
    document.getElementById('GroupName').style.display = 'inline-block';
    document.getElementById('AddGroup').style.display = 'inline-block';
    document.getElementById('Cancel').style.display = 'inline-block';
    document.getElementById('ShowGroupInput').style.display = 'none';
    document.getElementById('GroupName').value = "";
    event.preventDefault();
});

// Login event
document.getElementById("username_submit").addEventListener("click", function (event) {
    let user = document.getElementById("username").value;

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
    let input = document.getElementById('GroupName').value;
    
    if (input == '') {
        alert('Add Group Name or click cancel');
    } else {
        // invoke addGroup function
        connection.invoke("addGroup", input).catch(function (err) {
            return console.error(err.toString());
        });

        console.log('Group Added.');
        document.getElementById('group_list').value = input;

        document.getElementById('AddGroup').style.display = 'none'
        document.getElementById('Cancel').style.display = 'none';
        document.getElementById('GroupName').style.display = 'none';
        document.getElementById('ShowGroupInput').style.display = 'inline-block';
    }

    event.preventDefault();
});

// Add card event
const card = document.getElementById('card_list');

// adds group to list of groups on server
function addGroup(groupName) {
    let GroupList = document.getElementById('group_list');
    let option = document.createElement('option');
    option.text = groupName;
    GroupList.add(option);

    let new_group = document.createElement('div');
    new_group.dataset.groupName = groupName;

    card.appendChild(new_group);
}

// Cancel group event
document.getElementById('Cancel').addEventListener('click', function (event) {
    document.getElementById('AddGroup').style.display = 'none'
    document.getElementById('Cancel').style.display = 'none';
    document.getElementById('GroupName').style.display = 'none';
    document.getElementById('ShowGroupInput').style.display = 'inline-block';
});



// adds card to screen
document.getElementById('AddCardButton').addEventListener('click', (e) => {
    let group_name = document.getElementById('group_list').value;
    CreateCardHTML(group_name);
});


// selection change event
document.getElementById('group_list').addEventListener('change', (event) => {
    event.preventDefault();
    let test = document.getElementById('group_list').value;

    if (test == "Select a group..") {
        console.log('No group selected');
    } else {
        console.log(test);
        document.getElementById('AddCardButton').style.display = 'inline-block';
    }

});



//--// End of event listeners //--//




function CreateCardHTML(group_name) {
    // new card
    let new_card = document.createElement('form');
    new_card.className = 'card_layout';

    // card styling
    card.style.border = '1px solid black';

    // title input
    let input_title = document.createElement('input');
    input_title.placeholder = 'Title goes here..';
    input_title.name = 'title';
    input_title.type = 'text';

    // content input
    let input_content = document.createElement('input');
    input_content.placeholder = 'Content goes here..';
    input_content.name = 'content';
    input_content.type = 'text';

    // checkbox
    let checkbox = document.createElement('input');
    checkbox.name = 'checkbox';
    checkbox.type = 'checkbox';

    // label for checkbox
    let label = document.createElement('label');
    label.for = 'checkbox';
    label.textContent = 'Visible';

    // button for submitting content
    let button = document.createElement('input');
    button.type = 'submit';
    button.className = 'btn';
    button.value = 'Add';

    let edit_button = document.createElement('input');
    edit_button.type = 'submit';
    edit_button.className = 'btn';
    edit_button.value = 'Edit';

    let Title_header = document.createElement('h3');
    let content_body = document.createElement('p');
    let group = card.querySelector('div[data-group-name=' + group_name + "]")

    // event listener for the inner button
    button.addEventListener('click', (event) => {
        event.preventDefault();
        SendData(new_card);
        group.removeChild(new_card);
        document.getElementById('AddCardButton').style.display = 'inline-block';
    });

    // add elements to the screen
    new_card.appendChild(input_title);
    new_card.appendChild(input_content);
    new_card.appendChild(checkbox);
    new_card.appendChild(label);
    new_card.appendChild(button);
    card.appendChild(new_card);
    group.appendChild(new_card);


    // hide add button
    document.getElementById('AddCardButton').style.display = 'none';
}

// grabs the input data and sends it to the server
function SendData(form) {
    title = form.querySelector("input[name='title']").value;
    content = form.querySelector("input[name='content']").value;
    let visible = form.querySelector("input[name='checkbox']").value;
    let groupList = document.getElementById("group_list");
    let selectedGroup = groupList.options[groupList.selectedIndex].value;

    // send to server
    connection.invoke("addCard", selectedGroup, title, content).catch(function (err) {
        return console.error(err.toString());
    });
    console.log('Updated Card.');
}

function UpdateCardHTML(card_json, groupName) {
    let cardID = card_json.cardID;

    // new card
    let new_card = document.createElement('form');
    new_card.className = 'card_layout';
    new_card.dataset.cardID = cardID;

    // card styling
    card.style.border = '1px solid black';

    // checkbox
    let checkbox = document.createElement('input');
    checkbox.name = 'checkbox';
    checkbox.type = 'checkbox';

    // label for checkbox
    let label = document.createElement('label');
    label.for = 'checkbox';
    label.textContent = 'Visible';


    let edit_button = document.createElement('input');
    edit_button.type = 'submit';
    edit_button.className = 'btn';
    edit_button.value = 'Edit';

    let Title_header = document.createElement('h3');
    Title_header.textContent = card_json.title;
    let content_body = document.createElement('p');
    content_body.textContent = card_json.content;


    // add elements to the screen
    new_card.appendChild(Title_header);
    new_card.appendChild(content_body);
    new_card.appendChild(checkbox);
    new_card.appendChild(label);
    new_card.appendChild(edit_button);
    //card.appendChild(new_card);
    let group = card.querySelector('div[data-group-name=' + groupName + "]")
    group.appendChild(new_card);

    // hide add button
}

connection.on("updateCardLock", (cardID, userID, groupName) => {

});

function RemoveOldHTML() {

}