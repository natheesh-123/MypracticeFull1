using System.Globalization;
using Attendance_management.Data;
using Attendance_management.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Attendance_management.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("isOnline")]
        public ActionResult checkOnline()
        {
            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAllAttendancesCount()
        {
            var attendances = await _context.Attendances.ToListAsync();
            return Ok(attendances);
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetAllAttendances()
        {
            var attendances = await _context.Attendances.ToListAsync();
            return Ok(attendances.Count);
        }


        // https://localhost:7200/api/attendance/limit/1?startDate=2025-01-01&endDate=2025-01-30
        // https://localhost:7200/api/attendance/limit/1?startDate=null&endDate=null&role=null&status=null
        [HttpGet("limit/{count}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetLimitAttendance(int count, [FromQuery]string startDate, [FromQuery]string endDate, [FromQuery]string role, [FromQuery]string status)
        {
            Console.Clear();
            var roleList = role=="null" ? await _context.Attendances.Select(a=> a.User.Role).Distinct().ToListAsync() : new List<string> { role };
            var statusList = (status == "null") ? await _context.Attendances.Select(a => a.Status).Distinct().ToListAsync() : new List<string> { status };

            if (startDate == "null" || endDate == "null")
            {
                Console.WriteLine("The Date are null");
                var attendances = await _context.Attendances
                    .Where(a => statusList.Contains(a.Status) && roleList.Contains(a.User.Role))
                    .OrderByDescending(a => a.Date)
                    .Skip((count - 1) * 10)
                    .Take(10)
                    .Select(a => new Attendance
                    {
                        Id = a.Id,
                        UserId = a.UserId,
                        Date = a.Date,
                        Status = a.Status,
                        CreatedAt = a.CreatedAt,
                        UpdatedAt = a.UpdatedAt,
                        User = new User
                        {
                            Name = a.User.Name,
                            Role = a.User.Role
                        }
                    })
                    .ToListAsync();
                if(attendances != null)
                {
                    return Ok(attendances);
                }
            }
            else
            {
                var sDate = DateOnly.Parse(startDate);
                var eDate = DateOnly.Parse(endDate);

                var attendances = await _context.Attendances
                    .Where(a => a.Date >= sDate && a.Date <= eDate && statusList.Contains(a.Status) && roleList.Contains(a.User.Role))
                    .OrderByDescending(a => a.Date)
                    .Skip((count - 1) * 10)
                    .Take(10)
                    .Select(a => new Attendance
                    {
                        Id = a.Id,
                        UserId = a.UserId,
                        Date = a.Date,
                        Status = a.Status,
                        CreatedAt = a.CreatedAt,
                        UpdatedAt = a.UpdatedAt,
                        User = new User
                        {
                            Name = a.User.Name,
                            Role = a.User.Role
                        }
                    })
                    .ToListAsync();
                if (attendances != null)
                {
                    return Ok(attendances);
                }
            }
            return BadRequest();
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetAttendance(int id)
        {
            var attendance = await _context.Attendances
                .Where(a => a.UserId == id)
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            if (attendance == null)
            {
                return NotFound();
            }
            return Ok(attendance);
        }

        [HttpGet("{id}/limit/{count}")]
        public async Task<ActionResult<Attendance>> GetAttendanceLimit(int id, int count,[FromQuery] string startDate, [FromQuery] string endDate, [FromQuery] string status)
        {
            try{

                var statusList = (status == "null") ? await _context.Attendances.Select(a => a.Status).Distinct().ToListAsync() : new List<string> { status };
                if (startDate == "null" || endDate == "null")
                {
                    var attendances = await _context.Attendances
                        .Where(a => a.UserId == id && statusList.Contains(a.Status))
                        .OrderByDescending(a => a.Date)
                        .Skip((count - 1) * 10)
                        .Take(10)
                        .Select(a => new Attendance
                        {
                            Id = a.Id,
                            UserId = a.UserId,
                            Date = a.Date,
                            Status = a.Status,
                            CreatedAt = a.CreatedAt,
                            UpdatedAt = a.UpdatedAt,
                            User = new User
                            {
                                Name = a.User.Name,
                                Role = a.User.Role
                            }
                        })
                        .ToListAsync();
                    if (attendances != null)
                    {
                        return Ok(attendances);
                    }
                }
                else
                {
                    var sDate = DateOnly.Parse(startDate);
                    var eDate = DateOnly.Parse(endDate);

                    var attendances = await _context.Attendances
                        .Where(a => a.UserId == id && a.Date >= sDate && a.Date <= eDate && statusList.Contains(a.Status))
                        .OrderByDescending(a => a.Date)
                        .Skip((count - 1) * 10)
                        .Take(10)
                        .Select(a => new Attendance
                        {
                            Id = a.Id,
                            UserId = a.UserId,
                            Date = a.Date,
                            Status = a.Status,
                            CreatedAt = a.CreatedAt,
                            UpdatedAt = a.UpdatedAt,
                            User = new User
                            {
                                Name = a.User.Name,
                                Role = a.User.Role
                            }
                        })
                        .ToListAsync();
                    if (attendances != null)
                    {
                        return Ok(attendances);
                    }
                }
                return BadRequest();
            }
            catch{
                return BadRequest();
            }
        }



        [HttpGet("{id}/count")]
        public async Task<ActionResult<int>> GetAttendanceCount(int id)
        {
            var attendance = await _context.Attendances
                .Where(a => a.UserId == id)
                .ToListAsync();

            if (attendance == null)
            {
                return NotFound();
            }
            return Ok(attendance.Count);
        }

        [HttpGet("GetStatus")]
        public async Task<ActionResult<IEnumerable<string>>> getDistinctStatus(){
            try{
                var status = await _context.Attendances.
                            Select(a=>a.Status)
                            .Distinct()
                            .ToListAsync();
                
                return Ok(status);
            }
            catch{
                return BadRequest();
            }
        }
        [HttpGet("GetRoles")]
        public async Task<ActionResult<IEnumerable<string>>> getDistinctRoles(){
            try{
                var roles = await _context.Attendances.
                            Select(a=>a.User.Role)
                            .Distinct()
                            .ToListAsync();
                
                return Ok(roles);
            }
            catch{
                return BadRequest();
            }
        }

        [HttpGet("check/{id}")]
        public async Task<ActionResult<bool>> checkAttendance(int id, [FromQuery] string Date)
        {
            var cDate = DateOnly.Parse(Date);

            try
            {
                var att = await _context.Attendances
                    .Where(a => a.UserId == id && a.Date == cDate)
                    .ToListAsync();

                if(att.Count == 0)
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


        [HttpPost]
        public async Task<ActionResult> AddAttendance(Attendance attendance)
        {
            var newAttendance = new Attendance
            {
                UserId = attendance.UserId,
                Date = attendance.Date,
                Status = attendance.Status,
                Remarks = attendance.Remarks,
                // CreatedAt = attendance.CreatedAt,
                // UpdatedAt = DateTime.UtcNow
            };

            _context.Attendances.Add(newAttendance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendance", new { id = newAttendance.Id }, newAttendance);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAttendance(int id, Attendance updatedAttendance)
        {
            if (id != updatedAttendance.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedAttendance).State = EntityState.Modified;
            updatedAttendance.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var attendanceExists = await _context.Attendances.AnyAsync(a => a.Id == id);
                if (!attendanceExists)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAttendance(int id)
        {
            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
