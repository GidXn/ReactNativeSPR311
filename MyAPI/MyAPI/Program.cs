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
// Це основний файл конфігурації додатку ASP.NET Core

builder.Services.AddControllers();

// Налаштування підключення до бази даних PostgreSQL
// AppDbContext - це наш контекст Entity Framework для роботи з БД
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Налаштування системи Identity для аутентифікації та авторизації
// UserEntity - наша кастомна модель користувача
// RoleEntity - наша кастомна модель ролі
builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    // Налаштування вимог до пароля (спрощені для демонстрації)
    options.Password.RequireDigit = false;           // Не вимагає цифр
    options.Password.RequireLowercase = false;       // Не вимагає малих літер
    options.Password.RequireUppercase = false;       // Не вимагає великих літер
    options.Password.RequiredLength = 6;             // Мінімальна довжина 6 символів
    options.Password.RequireNonAlphanumeric = false; // Не вимагає спеціальних символів
})
    .AddEntityFrameworkStores<AppDbContext>()  // Використовуємо EF для зберігання даних
    .AddDefaultTokenProviders();               // Додаємо провайдери токенів для скидання пароля

// Налаштування JWT аутентифікації
// JWT (JSON Web Token) - це стандарт для безпечної передачі інформації між сторонами
builder.Services.AddAuthentication(options =>
{
    // Вказуємо схему аутентифікації за замовчуванням
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Налаштування параметрів JWT токена
    options.RequireHttpsMetadata = false;  // Не вимагаємо HTTPS (тільки для розробки!)
    options.SaveToken = true;              // Зберігаємо токен після успішної аутентифікації
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,            // Не перевіряємо видавця токена
        ValidateAudience = false,          // Не перевіряємо аудиторію токена
        ValidateIssuerSigningKey = true,   // Перевіряємо ключ підпису
        ValidateLifetime = true,           // Перевіряємо термін дії токена
        ClockSkew = TimeSpan.Zero,         // Не даємо додаткового часу на розбіжність годин
        // Ключ для підпису та перевірки токенів (береться з конфігурації)
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Отримуємо ім'я збірки для Swagger документації
var assemblyName = typeof(LoginModel).Assembly.GetName().Name;

// Налаштування Swagger для API документації
// Swagger - це інструмент для генерації інтерактивної документації API
builder.Services.AddSwaggerGen(opt =>
{
    // Додаємо XML коментарі до документації
    var fileDoc = $"{assemblyName}.xml";
    var filePath = Path.Combine(AppContext.BaseDirectory, fileDoc);
    opt.IncludeXmlComments(filePath);

    // Налаштування безпеки для Swagger (JWT Bearer токен)
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",                    // Назва заголовка
        In = ParameterLocation.Header,             // Місце розташування параметра
        Type = SecuritySchemeType.Http,             // Тип схеми безпеки
        Scheme = "bearer"                          // Схема авторизації
    });

    // Вказуємо, що всі ендпоінти потребують авторизації
    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}  // Пустий масив означає, що не потрібні додаткові ролі
        }
    });
});

// Реєстрація кастомних сервісів у контейнері DI
builder.Services.AddScoped<IImageService, ImageService>();        // Сервіс для роботи з зображеннями
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();  // Сервіс для роботи з JWT токенами

// Автоматичне сканування та реєстрація AutoMapper профілів
// AutoMapper - бібліотека для автоматичного маппінгу між об'єктами
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Налаштування HTTP пайплайну обробки запитів
// Порядок middleware важливий!

app.UseSwagger();        // Генерація Swagger JSON
app.UseSwaggerUI();      // Swagger UI інтерфейс

app.UseAuthentication(); // Аутентифікація користувача
app.UseAuthorization();  // Авторизація доступу до ресурсів

app.MapControllers();    // Маршрутизація до контролерів

// Налаштування статичних файлів для зображень
var dir = builder.Configuration["ImagesDir"];  // Отримуємо шлях до папки зображень з конфігурації
string path = Path.Combine(Directory.GetCurrentDirectory(), dir);
Directory.CreateDirectory(path);  // Створюємо папку, якщо вона не існує

// Налаштування middleware для обслуговування статичних файлів
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),  // Фізичний провайдер файлів
    RequestPath = $"/{dir}"                         // URL шлях для доступу до файлів
});

// Запуск ініціалізації бази даних (створення ролей та користувачів)
await app.SeedData();

// Запуск веб-додатку
app.Run();
