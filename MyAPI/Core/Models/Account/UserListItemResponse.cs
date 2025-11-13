using System;
using System.Collections.Generic;

namespace Core.Models.Account;

public class UserListItemResponse
{
    public long Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Image { get; set; }
    public DateTime DateCreated { get; set; }
    public bool EmailConfirmed { get; set; }
    public List<string> Roles { get; set; } = new();
}

