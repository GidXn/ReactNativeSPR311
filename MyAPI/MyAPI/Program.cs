using Core.Interfaces;
using Core.Models.Account;
using Core.Services;
using Domain;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyAPI;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Додаємо сервіси до контейнера DI (Dependency Injection)

// Реєструємо контролери для обробки HTTP запитів
builder.Services.AddControllers();

// Налаштовуємо підключення до бази даних PostgreSQL
// Використовуємо Entity Framework Core з PostgreSQL провайдером
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Налаштовуємо ASP.NET Core Identity для управління користувачами та ролями
// Використовуємо кастомні сутності UserEntity та RoleEntity
builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    // Налаштування політики паролів - спрощені вимоги для розробки
    options.Password.RequireDigit = false;           // Не вимагаємо цифр
    options.Password.RequireLowercase = false;       // Не вимагаємо малих літер
    options.Password.RequireUppercase = false;       // Не вимагаємо великих літер
    options.Password.RequiredLength = 6;             // Мінімальна довжина 6 символів
    options.Password.RequireNonAlphanumeric = false; // Не вимагаємо спеціальних символів
})
    .AddEntityFrameworkStores<AppDbContext>()  // Використовуємо EF Core як сховище
    .AddDefaultTokenProviders();               // Додаємо провайдери токенів для скидання паролів

// Налаштовуємо JWT аутентифікацію
// JWT (JSON Web Token) - це стандарт для безпечної передачі інформації між сторонами
builder.Services.AddAuthentication(options =>
{
    // Встановлюємо JWT Bearer як схему аутентифікації за замовчуванням
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Налаштування JWT Bearer аутентифікації
    options.RequireHttpsMetadata = false;  // Не вимагаємо HTTPS для розробки
    options.SaveToken = true;              // Зберігаємо токен для подальшого використання
    
    // Параметри валідації JWT токенів
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,        // Не перевіряємо видавця токена
        ValidateAudience = false,     // Не перевіряємо аудиторію токена
        ValidateIssuerSigningKey = true,  // Перевіряємо ключ підпису
        ValidateLifetime = true,      // Перевіряємо термін дії токена
        ClockSkew = TimeSpan.Zero,    // Не даємо додаткового часу на розбіжність годинників
        // Ключ для підпису та перевірки токенів (з конфігурації)
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Отримуємо назву збірки для генерації документації Swagger
var assemblyName = typeof(LoginModel).Assembly.GetName().Name;

// Налаштовуємо Swagger для документації API
// Swagger - це інструмент для генерації інтерактивної документації API
builder.Services.AddSwaggerGen(opt =>
{
    // Додаємо XML коментарі до документації
    var fileDoc = $"{assemblyName}.xml";
    var filePath = Path.Combine(AppContext.BaseDirectory, fileDoc);
    opt.IncludeXmlComments(filePath);

    // Налаштовуємо схему безпеки для JWT токенів в Swagger UI
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",           // Назва заголовка
        In = ParameterLocation.Header,    // Розташування параметра (в заголовку)
        Type = SecuritySchemeType.Http,    // Тип схеми безпеки
        Scheme = "bearer"                 // Схема авторизації
    });

    // Додаємо вимогу безпеки для всіх ендпоінтів
    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"  // Посилаємося на схему "Bearer" визначену вище
                }
            },
            new string[]{}  // Пустий масив означає, що не потрібні додаткові ролі
        }
    });
});

// Реєструємо кастомні сервіси в контейнері DI
builder.Services.AddScoped<IImageService, ImageService>();      // Сервіс для роботи з зображеннями
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>(); // Сервіс для генерації JWT токенів

// Додаємо AutoMapper для автоматичного маппінгу між моделями
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Налаштовуємо HTTP pipeline (послідовність middleware компонентів)

// Додаємо Swagger middleware для інтерактивної документації API
app.UseSwagger();      // Генерує JSON схему API
app.UseSwaggerUI();     // Надає веб-інтерфейс для тестування API

// Додаємо middleware для аутентифікації та авторизації
// Важливо: UseAuthentication має бути перед UseAuthorization
app.UseAuthentication();  // Перевіряє JWT токени
app.UseAuthorization();   // Перевіряє права доступу на основі ролей

// Маппимо контролери до маршрутів
app.MapControllers();

// Налаштовуємо статичні файли для зображень
var dir = builder.Configuration["ImagesDir"];  // Отримуємо шлях до папки зображень з конфігурації
string path = Path.Combine(Directory.GetCurrentDirectory(), dir);
Directory.CreateDirectory(path);  // Створюємо папку, якщо вона не існує

// Налаштовуємо middleware для обслуговування статичних файлів
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),  // Фізичний провайдер файлів
    RequestPath = $"/{dir}"                         // URL шлях для доступу до файлів
});

// Запускаємо ініціалізацію бази даних (створення ролей та користувачів)
await app.SeedData();

// Запускаємо веб-додаток
app.Run();
