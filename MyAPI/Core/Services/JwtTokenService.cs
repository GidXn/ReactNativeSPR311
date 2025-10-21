using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Domain.Entities.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Core.Services;

/// <summary>
/// Сервіс для роботи з JWT токенами
/// Відповідає за створення та валідацію JWT токенів для аутентифікації
/// </summary>
public class JwtTokenService(IConfiguration configuration,
    UserManager<UserEntity> userManager) : IJwtTokenService
{
    /// <summary>
    /// Створює JWT токен для користувача
    /// </summary>
    /// <param name="user">Користувач, для якого створюється токен</param>
    /// <returns>JWT токен у вигляді рядка</returns>
    public async Task<string> CreateTokenAsync(UserEntity user)
    {
        // Отримуємо секретний ключ з конфігурації
        var key = configuration["Jwt:Key"];

        // Створюємо список claims (тверджень) для токена
        // Claims - це інформація про користувача, яка буде зашифрована в токені
        var claims = new List<Claim>
        {
            new Claim("email", user.Email),                    // Email користувача
            new Claim("name", $"{user.LastName} {user.FirstName}"), // Повне ім'я
            new Claim("image", $"{user.Image}")                // Шлях до аватара
        };
        
        // Додаємо ролі користувача до claims
        foreach (var role in await userManager.GetRolesAsync(user))
        {
            claims.Add(new Claim("roles", role));
        }

        // Конвертуємо секретний ключ у байти для підпису токена
        var keyBytes = System.Text.Encoding.UTF8.GetBytes(key);

        // Створюємо об'єкт для підпису токена
        var symmetricSecurityKey = new SymmetricSecurityKey(keyBytes);

        // Вказуємо ключ і алгоритм підпису токена (HMAC SHA256)
        var signingCredentials = new SigningCredentials(
            symmetricSecurityKey,
            SecurityAlgorithms.HmacSha256);

        // Створюємо JWT токен з усіма параметрами
        var jwtSecurityToken = new JwtSecurityToken(
            claims: claims,                                    // Список claims (тверджень)
            expires: DateTime.UtcNow.AddDays(7),             // Термін дії токена - 7 днів
            signingCredentials: signingCredentials);           // Ключ підпису

        // Конвертуємо токен у рядок
        string token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

        return token;
    }
}
