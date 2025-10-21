using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Domain;

/// <summary>
/// Контекст бази даних для роботи з Entity Framework Core
/// Наслідується від IdentityDbContext для інтеграції з ASP.NET Core Identity
/// </summary>
public class AppDbContext : IdentityDbContext<UserEntity, RoleEntity, long,
        IdentityUserClaim<long>, UserRoleEntity, UserLoginEntity,
        IdentityRoleClaim<long>, IdentityUserToken<long>>
{
    /// <summary>
    /// Конструктор контексту бази даних
    /// </summary>
    /// <param name="opt">Опції конфігурації для DbContext</param>
    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt) { }
    
    /// <summary>
    /// Налаштовуємо конфігурацію моделі бази даних
    /// Викликається при створенні моделі EF Core
    /// </summary>
    /// <param name="builder">Будівельник моделі для конфігурації сутностей</param>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Викликаємо базовий метод для Identity конфігурації
        base.OnModelCreating(builder);
        
        // Налаштовуємо зв'язки для таблиці UserRoleEntity (багато-до-багатьох)
        builder.Entity<UserRoleEntity>(ur =>
        {
            // Налаштовуємо зв'язок з роллю (один UserRoleEntity до однієї RoleEntity)
            ur.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)        // Одна роль може мати багато UserRoleEntity
                .HasForeignKey(r => r.RoleId)     // Зовнішній ключ RoleId
                .IsRequired();                     // Зв'язок обов'язковий

            // Налаштовуємо зв'язок з користувачем (один UserRoleEntity до одного UserEntity)
            ur.HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)        // Один користувач може мати багато UserRoleEntity
                .HasForeignKey(u => u.UserId)     // Зовнішній ключ UserId
                .IsRequired();                     // Зв'язок обов'язковий
        });

        // Налаштовуємо зв'язки для таблиці UserLoginEntity
        builder.Entity<UserLoginEntity>(b =>
        {
            // Налаштовуємо зв'язок з користувачем (один UserLoginEntity до одного UserEntity)
            b.HasOne(l => l.User)
                .WithMany(u => u.UserLogins)       // Один користувач може мати багато UserLoginEntity
                .HasForeignKey(l => l.UserId)     // Зовнішній ключ UserId
                .IsRequired();                     // Зв'язок обов'язковий
        });
    }
}
