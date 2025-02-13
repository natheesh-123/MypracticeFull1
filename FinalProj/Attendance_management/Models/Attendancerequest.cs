using System;
using System.Collections.Generic;

namespace Attendance_management.Models;

public partial class Attendancerequest
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public DateOnly Date { get; set; }

    public string Status { get; set; } = null!;

    public string? Remarks { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User? User { get; set; }
}
