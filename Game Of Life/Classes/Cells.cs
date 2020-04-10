using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Threading;

namespace Game_Of_Life.Classes
{
    public class Cells
    {
        [JsonProperty("x")]
        public int x { get; set; }

        [JsonProperty("y")]
        public int y { get; set; }

        [JsonProperty("red")]
        public int red { get; set; }

        [JsonProperty("green")]
        public int green { get; set; }

        [JsonProperty("blue")]
        public int blue { get; set; }

        // We don't want the client to get the "LastUpdatedBy" property
        [JsonIgnore]
        public string LastUpdatedBy { get; set; }

        public Cells(int x, int y)
        {
            this.x = x;
            this.y = y;
            this.red = red;
            this.green = green;
            this.blue = blue;
        }

        public void setColor(int[] color)
        {
            this.red = color[0];
            this.green = color[1];
            this.blue = color[2];
        }

        public int[] getColor()
        {
            return new int[] { this.red, this.green, this.blue};
        }

        public override bool Equals(object obj)
        {
            if ((obj == null) || !this.GetType().Equals(obj.GetType()))
            {
                return false;
            }
            else
            {
                Cells cell = (Cells)obj;
                return (x == cell.x) && (y == cell.y);
            }
        }
    }
}
