using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using FinalProject.Hubs.Classes;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private static List<User> users = new List<User>();
        private static List<Card> cards = new List<Card>();
        private static Dictionary<int, Guid> groupCards = new Dictionary<int, Guid>();

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Client(Context.ConnectionId).SendAsync("showUsernameForm");
        }

        public async Task addUser(string username)
        {
            users.Add(new User(Context.ConnectionId, username));
            await Clients.Others.SendAsync("addUser", Context.ConnectionId, username);
        }

        public async Task removeUser(string username)
        {

        }

        public async Task editCardLock(int cardId)
        {
            await Clients.Others.SendAsync("lockCard", cardId);
        }

        public async Task addCard(int groupID, string title, string content)
        {
            Card card = new Card(Context.ConnectionId, title, content);
            await Clients.Others.SendAsync("UpdateCards", card);
        }

    }
}