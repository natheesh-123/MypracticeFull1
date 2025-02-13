using Attendance_management.Data;
using Attendance_management.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Attendance_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class PermissionController : Controller
    {

        private readonly ApplicationDbContext _context;

        public PermissionController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Permission>>> GetPermissions()
        {
            try
            {
                var permissions = await _context.Permissions
                    .Include(p => p.Role)
                    .Select(p => new Permission
                    {
                        Id = p.Id,
                        RoleId = p.RoleId,
                       PermissionName=p.PermissionName,
                       Role = new Role
                       {
                           RoleName = p.Role.RoleName
                       }
                    })
                    .ToListAsync();

                if (permissions == null || permissions.Count == 0)
                {
                    return NotFound("No permissions found.");
                }

                return Ok(permissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

       
        [HttpGet("{role}")]
        public async Task<ActionResult<IEnumerable<Permission>>> GetPermission(string role)
        {
            try
            {
                var permission = await _context.Permissions
                    .Where(p => p.Role.RoleName == role)
                    .Select(p => new Permission
                    {
                        PermissionName = p.PermissionName
                    })
                    .ToListAsync();

                if (permission == null)
                {
                    return NotFound($"Not Permission for Role {role}");
                }

                return Ok(permission);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Permission>> Post([FromBody] Permission permission)
        {
            if (permission == null)
            {
                return BadRequest("Permission cannot be null.");
            }
            var newPermission = new Permission
            {
                RoleId = permission.RoleId,
                PermissionName = permission.PermissionName
            };

            _context.Permissions.Add(newPermission);
            await _context.SaveChangesAsync();

            return Ok(newPermission);
            //CreatedAtAction(nameof(GetPermission), new { role = permission.Role.RoleName }, newPermission);
        }

        [HttpDelete("{permissionname}")]
        public async Task<IActionResult> Delete(string permissionname, [FromQuery]int roleid)
        {
            var permission = await _context.Permissions
                .Where(p => p.PermissionName == permissionname && p.RoleId == roleid)
                .FirstAsync();

            if (permission == null)
                return NotFound();

            _context.Permissions.Remove(permission);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
