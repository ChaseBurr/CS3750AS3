using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace FinalProject.Hubs.Classes
{

    public class User
    {
        [JsonProperty("userID")]
        private string userID { get; set; }

        [JsonProperty("username")]
        private string username { get; set; }

        public User(string userID, string username)
        {
            this.userID = userID;
            this.username = username;
        }

    }
}
