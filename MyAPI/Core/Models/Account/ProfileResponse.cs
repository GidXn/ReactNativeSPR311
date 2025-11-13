using System;
using System.Collections.Generic;

namespace Core.Models.Account;

public class ProfileResponse
{
    public string Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Image { get; set; }
    public DateTime DateCreated { get; set; }
    public List<string> Roles { get; set; } = new();
}

