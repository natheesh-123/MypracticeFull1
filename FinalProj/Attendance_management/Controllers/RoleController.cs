using Attendance_management.Data;
using Attendance_management.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Attendance_management.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public RoleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("onlyroles")]
        public async Task<ActionResult<IEnumerable<Role>>> GetRolesOnly()
        {
            var roles = await _context.Roles
                .Select(r => new
                {
                    Id = r.Id,
                    RoleName = r.RoleName
                })
                .ToListAsync();
            return Ok(roles);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            var roles = await _context.Roles
                .Select(r => new
                {
                    Id = r.Id,
                    RoleName = r.RoleName,
                    Permissions = r.Permissions
                    .Select(p => new
                    {
                        PermissionName = p.PermissionName
                    })
                .ToList()
                })
                .ToListAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(int id)
        {
            var role = await _context.Roles
                .Include(r => r.Permissions)
                .Where(r => r.Id == id)
                .Select(r => new Role
                {
                    RoleName = r.RoleName,
                    Permissions = r.Permissions
                })
                .FirstOrDefaultAsync();
            if (role == null)
                return NotFound();

            return Ok(role);
        }


        [HttpPost]
        public async Task<ActionResult<Role>> AddRole(Role role)
        {
            var newRole = new Role
            {
                // Id = role.Id,
                RoleName = role.RoleName,
            };

            _context.Roles.Add(newRole);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRole), new { id = newRole.Id }, newRole);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRole(int id, [FromBody] Role updaterole)
        {
            if (updaterole.Id != id && await _context.Roles.AnyAsync(r => r.Id == updaterole.Id))
            {
                return BadRequest("The new ID already exists in the database.");
            }

            var sql = @"
            UPDATE Roles
            SET id = {0}, role_name = {1}
            WHERE id = {2}";
            await _context.Database.ExecuteSqlRawAsync(sql, updaterole.Id, updaterole.RoleName, id);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
                return NotFound();

            try{
                _context.Roles.Remove(role);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch{
                return BadRequest();
            }
        }



    }
}
