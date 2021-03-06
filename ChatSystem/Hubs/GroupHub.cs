﻿using Microsoft.AspNetCore.SignalR;
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
                User newUser = new User(Context.ConnectionId, username);
                users.Add(newUser);
                await Clients.All.SendAsync("addUser", JsonConvert.SerializeObject(newUser, Formatting.Indented)); // add user to eveyone elses list of users
            }
            else await Clients.Client(Context.ConnectionId).SendAsync("error", "User Already Exists");
        }

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

        public async Task editCard(string cardID, string groupName, string title, string content)
        {
            Group group = groups.Find(g => g.name == groupName);
            if(group != null)
            {
                Card card = group.cards.Find(c => (c.cardID.ToString() == cardID));
                if(card != null)
                {
                    card.title = title;
                    card.content = content;
                    await Clients.All.SendAsync("removeCard", cardID, groupName);
                    await Clients.All.SendAsync("addCard", JsonConvert.SerializeObject(card));
                }
                else await Clients.Client(Context.ConnectionId).SendAsync("error", "card does not exist");
            }
            else await Clients.Client(Context.ConnectionId).SendAsync("error", "card does not exist");
        }

        public async Task toggleEditCardLock(string cardID, string groupName)
        {
            string userID = Context.ConnectionId;
            Group group = groups.Find(g => g.name == groupName);
            if (group != null)
            {
                Card card = group.cards.Find(c => ((c.cardID.ToString() == cardID) && (c.userID == userID))); // check card ownership
                if (card != null)
                {
                    card.editable = !card.editable;
                    await Clients.Others.SendAsync("updateCardLock", cardID, groupName, card.editable);
                }
                else await Clients.Client(Context.ConnectionId).SendAsync("error", "card does not exist");
            }
            else await Clients.Client(Context.ConnectionId).SendAsync("error", "card does not exist");
        }

        public async Task toggleCardVisibility(string cardID, string groupName)
        {
            string userID = Context.ConnectionId;
            Group group = groups.Find(g => g.name == groupName);
            if (group != null)
            {
                Card card = group.cards.Find(c => ((c.cardID.ToString() == cardID) && (c.userID == userID))); // check card ownership
                if (card != null)
                {
                    card.visibility = !card.visibility;
                    await Clients.Others.SendAsync("cardVisibility", cardID, groupName, card.visibility);
                }
                else await Clients.Client(Context.ConnectionId).SendAsync("error", "card does not exist");
            }
            else await Clients.Client(Context.ConnectionId).SendAsync("error", "group does not exist");
        }

        public async Task addCard(string groupName, string title, string content)
        {
            Card card = new Card(Context.ConnectionId, title, content);
            Group group = groups.Find(group => group.name == groupName);
            if (group != null)
            {
                group.cards.Add(card);
                await Clients.All.SendAsync("addCard", JsonConvert.SerializeObject(card, Formatting.Indented), groupName);
            }
        }

        public async Task removeCard(string cardID, string groupName)
        {
            await Clients.All.SendAsync("removeCard", cardID, groupName);
        }

        private class Group
        {
            public string name
            {
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