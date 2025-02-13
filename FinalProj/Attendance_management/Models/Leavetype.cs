using System;
using System.Collections.Generic;

namespace Attendance_management.Models;

public partial class Leavetype
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Leaverequesthistory> Leaverequesthistories { get; set; } = new List<Leaverequesthistory>();

    public virtual ICollection<Leaverequest> Leaverequests { get; set; } = new List<Leaverequest>();
}
