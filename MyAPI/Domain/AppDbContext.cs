using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Domain;

/// <summary>
/// Контекст бази даних для роботи з Entity Framework
/// Наслідується від IdentityDbContext для інтеграції з ASP.NET Core Identity
/// </summary>
public class AppDbContext : IdentityDbContext<UserEntity, RoleEntity, long,
        IdentityUserClaim<long>, UserRoleEntity, UserLoginEntity,
        IdentityRoleClaim<long>, IdentityUserToken<long>>
{
    /// <summary>
    /// Конструктор контексту бази даних
    /// </summary>
    /// <param name="opt">Опції конфігурації для Entity Framework</param>
    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt) { }
    
    /// <summary>
    /// Налаштування моделі бази даних при створенні
    /// Тут визначаються зв'язки між таблицями та обмеження
    /// </summary>
    /// <param name="builder">Будівельник моделі</param>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Викликаємо базовий метод для налаштування Identity таблиць
        base.OnModelCreating(builder);
        
        // Налаштування зв'язку між користувачами та ролями (багато-до-багатьох)
        builder.Entity<UserRoleEntity>(ur =>
        {
            // Кожна роль може мати багато користувачів
            ur.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(r => r.RoleId)
                .IsRequired();  // Зв'язок обов'язковий

            // Кожен користувач може мати багато ролей
            ur.HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(u => u.UserId)
                .IsRequired();  // Зв'язок обов'язковий
        });

        // Налаштування зв'язку між користувачами та їх логінами
        builder.Entity<UserLoginEntity>(b =>
        {
            // Кожен логін належить одному користувачу
            b.HasOne(l => l.User)
                .WithMany(u => u.UserLogins)
                .HasForeignKey(l => l.UserId)
                .IsRequired();  // Зв'язок обов'язковий
        });
    }
}
