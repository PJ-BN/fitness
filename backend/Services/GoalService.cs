using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class GoalService : IGoalService
    {
        private readonly ApplicationDbContext _context;

        public GoalService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Goal> GetGoalByIdAsync(int id)
        {
            return await _context.Goals.FindAsync(id);
        }

        public async Task<IEnumerable<Goal>> GetAllGoalsAsync()
        {
            return await _context.Goals.ToListAsync();
        }

        public async Task<IEnumerable<Goal>> GetGoalsByUserIdAsync(string userId)
        {
            return await _context.Goals.Where(g => g.UserId == userId).ToListAsync();
        }

        public async Task<Goal> CreateGoalAsync(Goal goal)
        {
            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<Goal> UpdateGoalAsync(Goal goal)
        {
            _context.Entry(goal).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<bool> DeleteGoalAsync(int id)
        {
            var goal = await _context.Goals.FindAsync(id);
            if (goal == null)
            {
                return false;
            }

            _context.Goals.Remove(goal);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<GoalHistoryDto>> GetGoalHistoryAsync(string userId)
        {
            return await _context.GoalHistories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.EffectiveFromDate)
                .Select(h => new GoalHistoryDto
                {
                    Id = h.Id,
                    UserId = h.UserId,
                    EffectiveFromDate = h.EffectiveFromDate,
                    DailyCalorieGoal = h.DailyCalorieGoal,
                    MacroProteinPct = h.MacroProteinPct,
                    MacroCarbsPct = h.MacroCarbsPct,
                    MacroFatPct = h.MacroFatPct,
                    CreatedAtUtc = h.CreatedAtUtc
                })
                .ToListAsync();
        }
    }
}
