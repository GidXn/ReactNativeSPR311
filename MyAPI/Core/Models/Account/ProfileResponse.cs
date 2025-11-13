using System;

namespace Core.Models.Account;

public class ProfileResponse
{
    /// <summary>
    /// Електронна пошта користувача
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Повне ім'я користувача
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Посилання на аватар користувача
    /// </summary>
    public string? Image { get; set; }

    /// <summary>
    /// Ролі користувача
    /// </summary>
    public IEnumerable<string> Roles { get; set; } = Array.Empty<string>();
}

