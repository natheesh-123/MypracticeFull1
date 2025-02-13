using Microsoft.AspNetCore.Mvc;
using Attendance_management.Data;
using Microsoft.EntityFrameworkCore;
using Attendance_management.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Attendance_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveTypesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public LeaveTypesController(ApplicationDbContext context)
        {
            _context = context;
        }
        // Get all leave types
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Leavetype>>> GetLeaveTypes()
        {
            return await _context.Leavetypes.ToListAsync();
        }
        // Get a leave type by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Leavetype>> GetLeaveType(int id)
        {
            var leaveType = await _context.Leavetypes.FindAsync(id);
            if (leaveType == null) return NotFound();
            return leaveType;
        }
        // Create a new leave type
        [HttpPost]
        public async Task<ActionResult<Leavetype>> CreateLeaveType(Leavetype leaveType)
        {
            //leaveType.CreatedAt = DateTime.UtcNow;
            //leaveType.UpdatedAt = DateTime.UtcNow;
            try
            {
                var newType = new Leavetype
                {
                    Name = leaveType.Name,
                    Description = leaveType.Description
                };
                _context.Leavetypes.Add(newType);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetLeaveType), new { id = newType.Id }, newType);
            }
            catch
            {
                return BadRequest("Unable to Add");
            }

        }
        // Update an existing leave type
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveType(int id, Leavetype leaveType)
        {
            //if (id != leaveType.Id) return BadRequest();
            var existingLeaveType = await _context.Leavetypes.FindAsync(id);
            //if (existingLeaveType == null) return NotFound();
            existingLeaveType.Name = leaveType.Name;
            existingLeaveType.Description = leaveType.Description;
            //existingLeaveType.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // Delete a leave type
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveType(int id)
        {
            var leaveType = await _context.Leavetypes.FindAsync(id);
            if (leaveType == null) return NotFound();
            _context.Leavetypes.Remove(leaveType);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}