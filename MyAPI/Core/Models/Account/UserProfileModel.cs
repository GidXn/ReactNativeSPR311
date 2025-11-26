namespace Core.Models.Account;

public class UserProfileModel
{
    public string FullName { get; set; } = String.Empty;
    public string? Image { get; set; } = null;
    public string Email { get; set; } = String.Empty;
    public string DateRegister { get; set; } = String.Empty;
    public string[] Roles { get; set; } = null!;
}
