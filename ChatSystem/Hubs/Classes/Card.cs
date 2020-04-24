using System;
using Newtonsoft.Json;

namespace FinalProject.Hubs.Classes
{
    internal class Card
    {
        
        public bool visibility;

        [JsonProperty("cardID")]
        public Guid cardID { get; set; }

        [JsonProperty("userID")]
        public string userID { get; set; }

        [JsonProperty("editable")]
        public bool editable { get; set; }

        [JsonProperty("title")]
        public string title { get; set; }

        [JsonProperty("content")]
        public string content { get; set; }


        public Card()
        {
            this.cardID = Guid.NewGuid();
            this.editable = this.visibility = true;
            this.content = "";
        }

        public Card(string userID, string title, string content)
        {
            this.cardID = Guid.NewGuid();
            this.userID = userID;
            this.editable = this.visibility = true;
            this.title = title;
            this.content = content;
        }

    }
}