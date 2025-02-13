using Attendance_management.Data;
using Attendance_management.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Attendance_management.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class UserController : ControllerBase
    {
        private ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("getDate")]
        public ActionResult<object> GetDate()
        {
            // Get the current date
            var currentDate = DateTime.Now.ToString("yyyy-MM-dd");

            // Create an anonymous object to return as JSON
            var result = new
            {
                date = currentDate
            };

            // Return the JSON object
            return Ok(result);
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUser()
        {
            var response = await _context.Users.ToListAsync();
            if (response == null)
            {
                return NotFound();
            }
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetUser(int id)
        {
            var response = await _context.Users.FindAsync(id);

            if (response == null)
            {
                return NotFound();
            }

            return Ok(response);
        }

        [HttpGet("{id}/verify")]
        public async Task<ActionResult<bool>> VerifyUser(int id, [FromQuery]string password)
        {
            var user = await _context.Users.FindAsync(id);

            if(user == null)
            {
                return NotFound("User Id Not Found");
            }
            return user.Password == password;
        }



        [HttpPost]
        public async Task<ActionResult> AddUser(User user)
        {
            var newUser = new User
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Password = user.Password,
                Role = user.Role,
                ProfilePicture = user.ProfilePicture,
                //CreatedAt = user.CreatedAt,
                //UpdatedAt = user.UpdatedAt
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = newUser.Id }, newUser);
        }


        

        


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, User updatedUser)
        {
            if (id != updatedUser.Id)
                return BadRequest();

            _context.Entry(updatedUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
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
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if(user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 status code
        }



    }
}
