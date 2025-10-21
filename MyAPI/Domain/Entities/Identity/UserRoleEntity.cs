using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity;

/// <summary>
/// Проміжна сутність для зв'язку багато-до-багатьох між користувачами та ролями
/// Розширює базову IdentityUserRole для додавання навігаційних властивостей
/// </summary>
public class UserRoleEntity : IdentityUserRole<long>
{
    /// <summary>
    /// Навігаційна властивість до користувача
    /// </summary>
    public virtual UserEntity User { get; set; }
    
    /// <summary>
    /// Навігаційна властивість до ролі
    /// </summary>
    public virtual RoleEntity Role { get; set; }
}
