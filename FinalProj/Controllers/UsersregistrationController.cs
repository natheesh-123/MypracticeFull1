using Attendance_management.Data;
using Attendance_management.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Attendance_management.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class UsersregistrationController : ControllerBase
    {
        
        private readonly ApplicationDbContext _context;
        public UsersregistrationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usersregistration>>> GetAllUserRegistration()
        {
            var response = await _context.Usersregistrations.ToListAsync();
            if (response == null)
            {
                return NotFound();
            }
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetUserRegistration(int id)
        {
            var response = await _context.Usersregistrations.FindAsync(id);

            if (response == null)
            {
                return NotFound();
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> AddUserRegistration(Usersregistration user)
        {

            try
            {
                if (string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
                {
                    return BadRequest("Name, Email, and Password are required.");
                }

                var newUser = new Usersregistration
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Password = user.Password,
                    Role = user.Role,
                    ProfilePicture = user.ProfilePicture,
                    //CreatedAt = DateTime.UtcNow,
                    //UpdatedAt = DateTime.UtcNow
                };

                //_context.Usersregistrations.Add(newUser);
                _context.Entry(newUser).State = EntityState.Added;

                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAllUserRegistration", new { id = newUser.Id }, newUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An internal server error occurred.");
            }
        }



        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUserRegistration(int id)
        {
            var user = await _context.Usersregistrations.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            try
            {
                _context.Usersregistrations.Remove(user);
                await _context.SaveChangesAsync();
                return NoContent(); // 204 status code
            }
            catch
            {
                return BadRequest($"Unable to delete User with ID {id}");
            }

        }


    }
}
