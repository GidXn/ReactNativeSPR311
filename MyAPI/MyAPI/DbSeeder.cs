using AutoMapper;
using Core.Constants;
using Core.Interfaces;
using Core.Models.Seeder;
using Domain;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MyAPI;

/// <summary>
/// Статичний клас для ініціалізації бази даних
/// Створює ролі та користувачів при першому запуску додатку
/// </summary>
public static class DbSeeder
{
    /// <summary>
    /// Метод розширення для WebApplication - ініціалізує дані в БД
    /// </summary>
    /// <param name="webApplication">Екземпляр веб-додатку</param>
    public static async Task SeedData(this WebApplication webApplication)
    {
        // Створюємо область видимості для сервісів
        // Це дозволяє отримати доступ до зареєстрованих сервісів
        using var scope = webApplication.Services.CreateScope();
        
        // Отримуємо необхідні сервіси з контейнера DI
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
        var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();

        // Застосовуємо міграції до бази даних
        // Це створить таблиці, якщо їх ще немає
        context.Database.Migrate();

        // Створюємо ролі, якщо їх ще немає в базі даних
        if (!context.Roles.Any())
        {
            // Проходимо по всіх ролях, визначених у константах
            foreach (var roleName in Roles.AllRoles)
            {
                var result = await roleManager.CreateAsync(new(roleName));
                if (!result.Succeeded)
                {
                    Console.WriteLine("Error Create Role {0}", roleName);
                }
            }
        }

        // Створюємо користувачів, якщо їх ще немає в базі даних
        if (!context.Users.Any())
        {
            var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();
            
            // Шлях до JSON файлу з даними користувачів
            var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Users.json");
            
            if (File.Exists(jsonFile))
            {
                try
                {
                    // Читаємо JSON файл з даними користувачів
                    var jsonData = await File.ReadAllTextAsync(jsonFile);
                    var users = JsonSerializer.Deserialize<List<SeederUserModel>>(jsonData);
                    
                    // Створюємо кожного користувача
                    foreach (var user in users)
                    {
                        // Маппимо модель користувача на сутність
                        var entity = mapper.Map<UserEntity>(user);
                        entity.UserName = user.Email;  // Встановлюємо UserName = Email
                        
                        // Завантажуємо та зберігаємо аватар користувача
                        entity.Image = await imageService.SaveImageFromUrlAsync(user.Image);
                        
                        // Створюємо користувача в системі Identity
                        var result = await userManager.CreateAsync(entity, user.Password);
                        
                        if (!result.Succeeded)
                        {
                            Console.WriteLine("Error Create User {0}", user.Email);
                            continue;  // Переходимо до наступного користувача
                        }
                        
                        // Додаємо ролі користувачу
                        foreach (var role in user.Roles)
                        {
                            if (await roleManager.RoleExistsAsync(role))
                            {
                                await userManager.AddToRoleAsync(entity, role);
                            }
                            else
                            {
                                Console.WriteLine("Not Found Role {0}", role);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                }
            }
            else
            {
                Console.WriteLine("Not Found File Users.json");
            }
        }
    }
}
