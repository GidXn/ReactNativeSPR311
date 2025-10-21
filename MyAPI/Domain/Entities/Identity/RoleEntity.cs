using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity;

/// <summary>
/// Сутність ролі, що розширює базову IdentityRole
/// Представляє ролі користувачів в системі (наприклад, User, Admin)
/// </summary>
public class RoleEntity : IdentityRole<long>
{
    /// <summary>
    /// Колекція користувачів, що мають цю роль (зв'язок багато-до-багатьох)
    /// </summary>
    public virtual ICollection<UserRoleEntity>? UserRoles { get; set; } = null;
    
    /// <summary>
    /// Конструктор за замовчуванням
    /// </summary>
    public RoleEntity() : base() { }
    
    /// <summary>
    /// Конструктор з назвою ролі
    /// </summary>
    /// <param name="roleName">Назва ролі</param>
    public RoleEntity(string roleName) : base(roleName) { }
}
