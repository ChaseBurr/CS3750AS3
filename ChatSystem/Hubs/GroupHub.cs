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
        private static List<Card> cards = new List<Card>();
        private static List<User> users = new List<User>();
        private static List<Group> groups = new List<Group>();

        public async Task Login(string username)
        {
            Context.Items["username"] = username;


            await Clients.Caller.SendAsync("sendstuff_raw_text", "hello!");

            cards.Add(new Card("some_userID", "some_title", "some content"));
            await Clients.Caller.SendAsync("sendstuff_1", cards);
            await Clients.Caller.SendAsync("sendstuff_2", users);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Client(Context.ConnectionId).SendAsync("showUsernameForm");
        }

        public async Task addUser(string username)
        {
            users.Add(new User(Context.ConnectionId, username));
            await Clients.Others.SendAsync("addUser", Context.ConnectionId, username);
            await Clients.Client(Context.ConnectionId).SendAsync("revealCards", JsonConvert.SerializeObject(groups, Formatting.Indented));
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
            groups.Add(new Group(groupName));
            await Clients.Others.SendAsync("addGroup", groupName);
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
            groups.Find(group => group.name == groupName).cards.Add(card);
            await Clients.Others.SendAsync("updateCards", card);
        }

        private class Group
        {
            public string name;
            public List<Card> cards;

            public Group(string name)
            {
                this.name = name;
            }
        }
    }
}