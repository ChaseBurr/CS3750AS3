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
document.getElementById('AddCardButton').addEventListener('click', (e) => {
    let new_card = document.createElement('div');
    new_card.addEventListener('click', (e_ => {
        new_card.style.background = 'pink';
    }));
    new_card.className = 'card_layout';


    let input_title = document.createElement('input');
    input_title.type = 'text';

    let input_content = document.createElement('input');
    input_content.type = 'text';

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'checkbox';

    let label = document.createElement('label');
    label.for = 'checkbox';

    new_card.appendChild(input_title);
    new_card.appendChild(input_content);
    new_card.appendChild(checkbox);
    new_card.appendChild(label);
    card.appendChild(new_card);

    //card.innerHTML += '<a> </a>'

    let groupList = document.getElementById("group_list")
    let selectedGroup = groupList.options[groupList.selectedIndex].value;
    connection.invoke("addCard", selectedGroup, "testTitle", "testContent").catch(function (err) {
        return console.error(err.toString());
    });

});

connection.on("addCard", function (card) {
    //let newCard = JSON.parse(card);
    console.log(card);
});


//--// End of event listeners //--//



