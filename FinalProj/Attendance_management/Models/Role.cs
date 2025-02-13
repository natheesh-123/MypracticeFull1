using System;
using System.Collections.Generic;

namespace Attendance_management.Models;

public partial class Role
{
    public int Id { get; set; }

    public string RoleName { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Permission> Permissions { get; set; } = new List<Permission>();
}
