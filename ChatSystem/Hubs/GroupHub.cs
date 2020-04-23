using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using FinalProject.Hubs.Classes;
using Newtonsoft.Json;

namespace SignalRChat.Hubs
{
    public class GroupHub : Hub
    {
        private static List<User> users = new List<User>();
        private static List<Group> groups = new List<Group>();

        public async Task Login(string username)
        {
            Context.Items["username"] = username;
            await addUser(username);

            //await Clients.Caller.SendAsync("sendstuff_raw_text", "hello!");
            //cards.Add(new Card("some_userID", "some_title", "some content"));
            //await Clients.Caller.SendAsync("sendstuff_1", cards);
            //await Clients.Caller.SendAsync("sendstuff_2", users);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Client(Context.ConnectionId).SendAsync("showUsernameForm");
            await Clients.Client(Context.ConnectionId).SendAsync("addGroup", JsonConvert.SerializeObject(groups, Formatting.Indented)); // update groups and cards to new user
        }

        public async Task addUser(string username)
        {
            if (users.Find(user => user.username == username) == null)
            {
                users.Add(new User(Context.ConnectionId, username));
                await Clients.Others.SendAsync("addUser", Context.ConnectionId, username); // add user to eveyone elses list of users
            }
            else await Clients.Client(Context.ConnectionId).SendAsync("error", "User Already Exists");
        }

        //[
        //  {
        //    "Name": "groupname1",
        //    [{"cardID": "card1"
        //     "title": "title1"
        //     "content": "content1"
        //    },{
        //    }]
        //  },
        //  {
        //    "Name": "Product 2",
        //    "ExpiryDate": "2009-07-31T00:00:00Z",
        //    "Price": 12.50,
        //    "Sizes": null
        //  }
        //]

        public async Task removeUser()
        {
            users.Find(user => user.userID == Context.ConnectionId);
            await Clients.Others.SendAsync("removeUser", Context.ConnectionId);
        }

        public async Task addGroup(string groupName)
        {
            if (groups.Find(group => group.name == groupName) == null)
            {
                Group newGroup = new Group(groupName);
                groups.Add(newGroup);
                Group[] newGroups = { newGroup };
                await Clients.All.SendAsync("addGroup", JsonConvert.SerializeObject(newGroups, Formatting.Indented));
            }
            else await Clients.Client(Context.ConnectionId).SendAsync("error", "Group Already Exists");
        }

        public async Task removeGroup(string groupName)
        {
            groups.Remove(groups.Find(group => group.name == groupName));
            await Clients.Others.SendAsync("removeGroup", groupName);
        }

        public async Task editCardLock(int cardId)
        {
            await Clients.Others.SendAsync("lockCard", cardId);
        }

        public async Task addCard(string groupName, string title, string content)
        {
            Card card = new Card(Context.ConnectionId, title, content);
            Group group = groups.Find(group => group.name == groupName);
            if(group != null)
            {
                group.cards.Add(card);
                await Clients.All.SendAsync("addCard", JsonConvert.SerializeObject(card, Formatting.Indented), groupName);
                Console.WriteLine("it hit me 2");
            }
            Console.WriteLine("it hit me");
        }

        private class Group
        {
            public string name {
                get; set;
            }
            public List<Card> cards;

            public Group(string name)
            {
                this.name = name;
                this.cards = new List<Card>();
            }
    }
    }
}