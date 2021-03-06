﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace FinalProject.Hubs.Classes
{

    public class User
    {
        [JsonProperty("userID")]
        public string userID { get; set; }

        [JsonProperty("username")]
        public string username { get; set; }

        public User(string userID, string username)
        {
            this.userID = userID;
            this.username = username;
        }

    }
}
