using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity;

/// <summary>
/// Сутність користувача, що наслідується від IdentityUser
/// Розширює базову функціональність Identity додатковими полями
/// </summary>
public class UserEntity : IdentityUser<long>
{
    /// <summary>
    /// Дата створення користувача
    /// DateTimeKind.Utc забезпечує коректну роботу з часовими поясами
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
    /// virtual дозволяє Entity Framework створювати проксі-класи для lazy loading
    /// </summary>
    public virtual ICollection<UserRoleEntity>? UserRoles { get; set; }
    
    /// <summary>
    /// Колекція логінів користувача (зв'язок один-до-багатьох)
    /// </summary>
    public virtual ICollection<UserLoginEntity>? UserLogins { get; set; }
}
