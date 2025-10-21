using AutoMapper;
using Core.Constants;
using Core.Interfaces;
using Core.Models.Account;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers;

/// <summary>
/// Контролер для обробки операцій з акаунтом користувача
/// Включає логін та реєстрацію користувачів
/// </summary>
[Route("api/[controller]/[action]")]
[ApiController]
public class AccountController(IJwtTokenService jwtTokenService,
        IMapper mapper, IImageService imageService,
        UserManager<UserEntity> userManager) : ControllerBase
{
    /// <summary>
    /// Аутентифікація користувача (логін)
    /// </summary>
    /// <param name="model">Модель з даними для логіну (email та пароль)</param>
    /// <returns>JWT токен при успішній аутентифікації або помилку</returns>
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        // Шукаємо користувача за email адресою
        var user = await userManager.FindByEmailAsync(model.Email);
        
        // Перевіряємо чи існує користувач та чи правильний пароль
        if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
        {
            // Генеруємо JWT токен для користувача
            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new { Token = token });
        }
        
        // Повертаємо помилку авторизації
        return Unauthorized("Invalid email or password");
    }

    /// <summary>
    /// Реєстрація нового користувача
    /// </summary>
    /// <param name="model">Модель з даними для реєстрації (включає файл зображення)</param>
    /// <returns>JWT токен при успішній реєстрації або помилку</returns>
    [HttpPost]
    public async Task<IActionResult> Register([FromForm] RegisterModel model)
    {
        // Конвертуємо модель реєстрації в сутність користувача за допомогою AutoMapper
        var user = mapper.Map<UserEntity>(model);

        // Зберігаємо зображення користувача (аватар)
        user.Image = await imageService.SaveImageAsync(model.ImageFile!);

        // Створюємо користувача в системі Identity
        var result = await userManager.CreateAsync(user, model.Password);
        
        if (result.Succeeded)
        {
            // Додаємо користувачу роль "User" за замовчуванням
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
