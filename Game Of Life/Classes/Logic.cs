using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game_Of_Life.Classes
{
    public class Logic
    {
        private Cells[,] CurrentGeneration = new Cells[22, 22];
        private Cells[,] NextGeneration = new Cells[22, 22];

        public Logic(List<Cells> cells)
        {
            foreach (Cells cell in cells)
                CurrentGeneration[cell.x+1, cell.y+1] = cell;
            doLogic();
        }

        private void doLogic()
        {
            for (int i = 1; i < 21; i++)
            {
                for (int j = 1; j < 21; j++)
                {
                    bool alive = false;
                    if (CurrentGeneration[i, j] != null) alive = true;
                    List<Cells> neighbors = new List<Cells>();

                    for (int k = -1; k < 2; k++)
                    {
                        for (int l = -1; l < 2; l++)
                        {
                            if (!(k == 0 && l == 0))
                            {
                                if (CurrentGeneration[i + k, j + l] != null)
                                    neighbors.Add(CurrentGeneration[i + k, j + l]);
                            }
                        }
                    }

                    if ((alive && neighbors.Count == 2) || (alive && neighbors.Count == 3) || (!alive && neighbors.Count == 3))
                    {
                        int red = 0;
                        int green = 0;
                        int blue = 0;
                        foreach (Cells cell in neighbors)
                        {
                            red += cell.red;
                            green += cell.green;
                            blue += cell.blue;
                        }
                        red /= neighbors.Count;
                        green /= neighbors.Count;
                        blue /= neighbors.Count;
                        NextGeneration[i, j] = new Cells(i - 1, j - 1);
                        NextGeneration[i, j].setColor(new int[] { red, green, blue });
                    }

                }
            }
        }

        public List<Cells> getList()
        {
            List<Cells> cells = new List<Cells>();

            // logic to return list of cells
            for (int i = 1; i < 21; i++)
            {
                for (int j = 1; j < 21; j++)
                {
                    if (NextGeneration[i, j] != null)
                    {
                        cells.Add(NextGeneration[i, j]);
                    }
                }
            }
            return cells;
        }
    }
}
