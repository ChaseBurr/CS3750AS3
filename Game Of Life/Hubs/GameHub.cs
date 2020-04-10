using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Threading;
using Game_Of_Life.Classes;

namespace SignalRGame.Hubs 
{
    public class GameHub : Hub
    {

        // game variables
        private static Dictionary<string, int[]> colorMap = new Dictionary<string, int[]>(); // user color assignment
        public static List<Cells> cells = new List<Cells>(); // cell array

        /* Game State Communication Functions Start */
        public async Task SendNewCells(int x, int y)
        {
            Cells cell = new Cells(x, y);
            cell.setColor(colorMap[Context.ConnectionId]);
            if ((cells.RemoveAll(innerCell => (innerCell.x == x && innerCell.y == y))) == 0)
            {
                cells.Add(cell);
            }
            // syncs new tile with all users
            await Clients.All.SendAsync("UpdateCells", cells);
        }
        public override async Task OnConnectedAsync()
        {
            // Assign colors for each user
            lock (colorMap)
            {
                // currently does not check if color is in use
                Random random = new Random();
                colorMap.Add(Context.ConnectionId, new[] { random.Next(0, 255), random.Next(0, 255), random.Next(0, 255) });
            }
            await Clients.Client(Context.ConnectionId).SendAsync("UpdateCells", cells); // catch up new clients
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            // remove users when they disconnect
            lock (colorMap)
            {
                colorMap.Remove(Context.ConnectionId);
            }
            return base.OnDisconnectedAsync(exception);
        }
        /* Game State Communication Functions End */


        /* Game Control Functions Start */
        public async Task NextGeneration()
        {
            cells = GameOfLife.nextGeneration(cells);
            await Clients.All.SendAsync("UpdateCells", cells);
        }
        public async Task AutoGenerationToggle()
        {
            await Clients.All.SendAsync("ChangePlayStopButton", GameOfLife.AutoGeneration());
        }
        public async Task AutoGeneration(bool playStop)
        {
            await Clients.All.SendAsync("ChangePlayStopButton", GameOfLife.AutoGeneration(playStop));
        }
        public async Task AutoGenerationInterval(int interval)
        {
            if (interval < 200 || interval > 5000) throw new HubException("Your interval is not within the correct range");
            await Clients.Others.SendAsync("ChangeIntervalSlider", GameOfLife.AutoGeneration(interval));
        }
        /* Game Control Functions End */

    }

    public class GameOfLife : IHostedService
    {
        private readonly IHubContext<GameHub> Context;

        // game timer
        private static System.Timers.Timer generationClock;

        public GameOfLife(IHubContext<GameHub> context)
        {
            Context = context;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // initialize time keeper
            generationClock = new System.Timers.Timer(2000);
            generationClock.Elapsed += async (sender, e) =>
            {
                GameHub.cells = nextGeneration(GameHub.cells);
                await Context.Clients.All.SendAsync("UpdateCells", GameHub.cells);
            };
            generationClock.AutoReset = true;
            generationClock.Enabled = false;

            return Task.CompletedTask;
        }

        /* Game Logic Functions Start */
        public static List<Cells> nextGeneration(List<Cells> cells)
        {
            // Calculates Next Generation of the Game Board
            Logic logic = new Logic(cells);

            return logic.getList();
        }
        /* Game Logic Functions End */

        /* Clock Funtions Start */
        public static bool AutoGeneration()
        {
            // toggle clock state
            return generationClock.Enabled = !generationClock.Enabled;
        }

        public static bool AutoGeneration(bool state)
        {
            // set clock state
            return generationClock.Enabled = state;
        }
        public static int AutoGeneration(double interval)
        {
            // set clock interval
            generationClock.Interval = interval;
            return Convert.ToInt32(Math.Floor(generationClock.Interval));
        }
        /* Clock Funtions End */

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }

}