using Attendance_management.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Attendance_management.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaverequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeaverequestController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet("check/{id}")]
        public async Task<ActionResult<bool>> checkLeaveRequest(int id, [FromQuery] string Date)
        {
            var cDate = DateOnly.Parse(Date);

            try
            {
                var leavereq = await _context.Leaverequests
                    .Where(lr => lr.UserId == id && lr.Date == cDate)
                    .ToListAsync();

                if (leavereq.Count == 0)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch
            {
                return BadRequest(false);
            }


        }

    }
}
