using AutoMapper;
using Core.Constants;
using Core.Interfaces;
using Core.Models.Account;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers;

/// <summary>
/// Контролер для управління акаунтами користувачів
/// Обробляє реєстрацію, авторизацію та інші операції з користувачами
/// </summary>
[Route("api/[controller]/[action]")]  // Базовий маршрут для всіх дій контролера
[ApiController]
public class AccountController(IJwtTokenService jwtTokenService,
        IMapper mapper, IImageService imageService,
        UserManager<UserEntity> userManager) : ControllerBase
{
    /// <summary>
    /// Авторизація користувача в системі
    /// </summary>
    /// <param name="model">Модель з даними для входу (email та password)</param>
    /// <returns>JWT токен при успішній авторизації або помилку</returns>
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        // Знаходимо користувача за email адресою
        var user = await userManager.FindByEmailAsync(model.Email);
        
        // Перевіряємо чи існує користувач та чи правильний пароль
        if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
        {
            // Генеруємо JWT токен для авторизованого користувача
            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new { Token = token });
        }
        
        // Повертаємо помилку авторизації
        return Unauthorized("Invalid email or password");
    }

    /// <summary>
    /// Реєстрація нового користувача в системі
    /// </summary>
    /// <param name="model">Модель з даними для реєстрації (включаючи файл зображення)</param>
    /// <returns>JWT токен при успішній реєстрації або помилку</returns>
    [HttpPost]
    public async Task<IActionResult> Register([FromForm] RegisterModel model)
    {
        // Використовуємо AutoMapper для конвертації моделі реєстрації в сутність користувача
        var user = mapper.Map<UserEntity>(model);

        // Зберігаємо завантажене зображення та отримуємо його назву
        user.Image = await imageService.SaveImageAsync(model.ImageFile!);

        // Створюємо нового користувача з хешованим паролем
        var result = await userManager.CreateAsync(user, model.Password);
        
        if (result.Succeeded)
        {
            // Додаємо користувача до ролі "User" (звичайний користувач)
            await userManager.AddToRoleAsync(user, Roles.User);
            
            // Генеруємо JWT токен для нового користувача
            var token = await jwtTokenService.CreateTokenAsync(user);
            
            return Ok(new
            {
                Token = token
            });
        }
        else
        {
            // Повертаємо помилку реєстрації з деталями
            return BadRequest(new
            {
                status = 400,
                isValid = false,
                errors = "Registration failed"
            });
        }
    }
}
