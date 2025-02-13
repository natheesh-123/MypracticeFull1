using System;
using System.Collections.Generic;

namespace Attendance_management.Models;

public partial class Leaverequest
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? LeaveTypeId { get; set; }

    public DateOnly Date { get; set; }

    public string Status { get; set; } = null!;

    public string? Reason { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Leavetype? LeaveType { get; set; }

    public virtual User? User { get; set; }
}
