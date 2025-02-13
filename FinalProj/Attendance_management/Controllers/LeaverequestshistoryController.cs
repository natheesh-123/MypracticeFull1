using Attendance_management.Data;
using Attendance_management.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Attendance_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaverequestshistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeaverequestshistoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Leaverequesthistories - G`et all leave requests
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Leaverequest>>> GetLeaveRequests([FromQuery] string role)
        //{
        //    if (role == "null")
        //        return await _context.Leaverequesthistories
        //                         //.Include(l => l.User)s
        //                         .Select(l => new Leaverequest
        //                         {
        //                             Id = l.Id,
        //                             Date = l.Date,
        //                             LeaveType = new Leavetype
        //                             {
        //                                 Name = l.LeaveType.Name
        //                             },
        //                             User = new User
        //                             {
        //                                 Id = l.User.Id,
        //                                 Name = l.User.Name
        //                             },
        //                             Reason = l.Reason,
        //                             Status = l.Status,
        //                             CreatedAt = l.CreatedAt
        //                         })
        //                         .ToListAsync();
        //    else
        //        return await _context.Leaverequesthistories
        //                .Where(l => l.User.Role == role)
        //                .Select(l => new Leaverequest
        //                {
        //                    Id = l.Id,
        //                    Date = l.Date,
        //                    LeaveType = new Leavetype
        //                    {
        //                        Name = l.LeaveType.Name
        //                    },
        //                    User = new User
        //                    {
        //                        Id = l.User.Id,
        //                        Name = l.User.Name
        //                    },
        //                    Reason = l.Reason,
        //                    Status = l.Status,
        //                    CreatedAt = l.CreatedAt
        //                })
        //                .ToListAsync();
        //}

        // GET: api/Leaverequesthistories/{id} - Get a leave request by ID

        [HttpGet("check/{id}")]
        public async Task<ActionResult<bool>> checkLeaveHistoryRequest(int id, [FromQuery] string Date)
        {
            var cDate = DateOnly.Parse(Date);

            try
            {
                var leavereq = await _context.Leaverequesthistories
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

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerator<Leaverequest>>> GetLeaveRequest(int id)
        {
            var leaveRequest = await _context.Leaverequesthistories
                                            .Where(l => l.UserId == id)
                                             .ToListAsync();

            if (leaveRequest == null)
            {
                return NotFound();
            }

            return Ok(leaveRequest);
        }

        [HttpGet("Countleaves/{id}")]
        public async Task<ActionResult<int>> getLeaveCount(int id, [FromQuery] string Date)
        {
            var checkDate = DateOnly.Parse(Date);

            try
            {
                var leaves = @"
                Select * from LeaveRequestHistory l
                WHERE user_id = {0} 
                    and MONTH({1}) = month(l.date)
                    and YEAR({1}) = YEAR(l.date)
                    and status = 'Accepted'";
                var leavecount = await _context.Leaverequesthistories
            .FromSqlRaw(leaves, id, checkDate)
            .CountAsync();

                var result = new
                {
                    count = leavecount
                };

                return Ok(result);
            }
            catch
            {
                return BadRequest();
            }
        }


        //[HttpGet("Countleaves/{id}")]
        //public async Task<ActionResult<int>> getLeaveCount(int id)
        //{
        //    try
        //    {
        //        var leaves = await _context.Leaverequests
        //            .Where(lr => lr.UserId == id)
        //            .ToListAsync();

        //        return Ok(leaves.Count);
        //    }
        //    catch
        //    {
        //        return BadRequest();
        //    }
        //}




        // POST: api/Leaverequesthistories - Create a new leave request
        [HttpPost]
        public async Task<ActionResult<Leaverequest>> PostLeaveRequest(Leaverequesthistory leaveRequest)
        {
            leaveRequest.CreatedAt = DateTime.UtcNow;
            leaveRequest.UpdatedAt = DateTime.UtcNow;
            //leaveRequest.Status = "Pending";

            _context.Leaverequesthistories.Add(leaveRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLeaveRequest), new { id = leaveRequest.Id }, leaveRequest);
        }

        // PUT: api/Leaverequesthistories/{id} - Update a leave request
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutLeaveRequest(int id, Leaverequest leaveRequest)
        //{
        //    if (id != leaveRequest.Id)
        //    {
        //        return BadRequest();
        //    }

        //    leaveRequest.UpdatedAt = DateTime.UtcNow;
        //    _context.Entry(leaveRequest).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!_context.Leaverequesthistories.Any(e => e.Id == id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// DELETE: api/Leaverequesthistories/{id} - Delete a leave request
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteLeaveRequest(int id)
        //{
        //    var leaveRequest = await _context.Leaverequesthistories.FindAsync(id);
        //    if (leaveRequest == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Leaverequesthistories.Remove(leaveRequest);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}
    }
}
