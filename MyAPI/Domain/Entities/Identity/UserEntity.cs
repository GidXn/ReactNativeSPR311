using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity;

/// <summary>
/// Сутність користувача, що розширює базову IdentityUser
/// Містить додаткові поля для профілю користувача
/// </summary>
public class UserEntity : IdentityUser<long>
{
    /// <summary>
    /// Дата створення користувача (UTC час)
    /// </summary>
    public DateTime DateCreated { get; set; } = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
    
    /// <summary>
    /// Ім'я користувача
    /// </summary>
    public string? FirstName { get; set; } = null;
    
    /// <summary>
    /// Прізвище користувача
    /// </summary>
    public string? LastName { get; set; } = null;
    
    /// <summary>
    /// Шлях до аватара користувача
    /// </summary>
    public string? Image { get; set; } = null;

    /// <summary>
    /// Колекція ролей користувача (зв'язок багато-до-багатьох)
    /// </summary>
    public virtual ICollection<UserRoleEntity>? UserRoles { get; set; }
    
    /// <summary>
    /// Колекція входів користувача в систему
    /// </summary>
    public virtual ICollection<UserLoginEntity>? UserLogins { get; set; }
}
