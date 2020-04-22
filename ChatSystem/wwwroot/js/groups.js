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
let GroupList = [];


//--// On connection functions //--//

connection.on("UpdateGroups", (groups) => {
    groups.forEach(element => GroupList.push(groups));
    console.log('Group list Updated');
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
        addGroup(input);

        // invoke addGroup function
        connection.invoke("addGroup", input).catch(function (err) {
            return console.error(err.toString());
        });

        console.log('Group Added.');
        document.getElementById('group_list').value = document.getElementById('GroupName').value;

        document.getElementById('AddGroup').style.display = 'none'
        document.getElementById('Cancel').style.display = 'none';
        document.getElementById('GroupName').style.display = 'none';
    document.getElementById('AddCardButton').style.display = 'inline-block';
        document.getElementById('ShowGroupInput').style.display = 'inline-block';
    }

    event.preventDefault();
});

function addGroup(groupName) {
    let GroupList = document.getElementById('group_list');
    let option = document.createElement('option');
    option.text = groupName;
    GroupList.add(option);
}

connection.on("addGroup", function (groupName) {
    addGroup(groupName);
});

// Cancel group event
document.getElementById('Cancel').addEventListener('click', function (event) {
    document.getElementById('AddGroup').style.display = 'none'
    document.getElementById('Cancel').style.display = 'none';
    document.getElementById('GroupName').style.display = 'none';
    document.getElementById('ShowGroupInput').style.display = 'inline-block';
});

// Add card event
const card = document.getElementById('card_list');
let card_count = 0;
document.getElementById('AddCardButton').addEventListener('click', (e) => {
    let new_card = document.createElement('div');
    new_card.className = 'card_layout';
    new_card.id = 'Card_' + card_count;

    // event listener for when the div is clicked (might not need)
    new_card.addEventListener('click', (e_ => {
        new_card.style.background = 'pink';
    }));

    card.style.border = '1px solid black';

    // title input
    let input_title = document.createElement('input');
    input_title.id = 'title_text' + card_count;
    input_title.type = 'text';
    input_title.placeholder = 'Title goes here..';

    // content input
    let input_content = document.createElement('input');
    input_content.type = 'text';
    input_content.placeholder = 'Content goes here..';
    input_content.id = 'conent_text' + card_count;

    // checkbox
    let checkbox = document.createElement('input');
    checkbox.id = 'CheckBoxOption' + card_count;
    checkbox.type = 'checkbox';
    checkbox.name = 'checkbox';

    // label for checkbox
    let label = document.createElement('label');
    label.id = 'Visible_' + card_count;
    label.for = 'checkbox';
    label.textContent = 'Visible';

    // button for submitting content
    let button = document.createElement('input');
    button.type = 'submit';
    button.id = 'CardSubmitButton' + card_count;
    button.getElementById = 'CardInputCheck';
    button.className = 'btn';
    button.textContent = 'Add';

    let title = "default text";
    let content = "default text";

    // event listener for the inner button
    button.addEventListener('click', (e) => {
        title = document.getElementById('title_text' + card_count).value;
        content = document.getElementById('conent_text' + card_count).value;
        document.removeChild(document.getElementById('title_text' + card_count));
        document.removeChild(document.getElementById('content_text' + card_count));
        document.removeChild(document.getElementById('CardSubmitButton' + card_count));
        document.getElementById('AddCardButton').style.display = 'inline-block';
    });

    // add elements to the screen
    new_card.appendChild(input_title);
    new_card.appendChild(input_content);
    new_card.appendChild(checkbox);
    new_card.appendChild(label);
    new_card.appendChild(button);
    card.appendChild(new_card);

    // hide add button
    document.getElementById('AddCardButton').style.display = 'none';

    // send to server
    let groupList = document.getElementById("group_list");
    let selectedGroup = groupList.options[groupList.selectedIndex].value;
    connection.invoke("addCard", selectedGroup, title, content).catch(function (err) {
        return console.error(err.toString());
    });

    // increment count
    card_count++;
});

connection.on("addCard", function (card) {
    //let newCard = JSON.parse(card);
    console.log(card);
});



//--// End of event listeners //--//



