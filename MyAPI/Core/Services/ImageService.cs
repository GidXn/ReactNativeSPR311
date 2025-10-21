using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using Core.Interfaces;

namespace Core.Services;

/// <summary>
/// Сервіс для роботи з зображеннями
/// Відповідає за збереження, обробку та видалення зображень у різних розмірах
/// </summary>
public class ImageService(IConfiguration configuration) : IImageService
{
    /// <summary>
    /// Видаляє зображення у всіх розмірах
    /// </summary>
    /// <param name="name">Назва файлу зображення</param>
    /// <returns>Task для асинхронної операції</returns>
    public async Task DeleteImageAsync(string name)
    {
        // Отримуємо список розмірів зображень з конфігурації
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();
        var dir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!);

        // Використовуємо паралельне виконання для видалення файлів різних розмірів
        Task[] tasks = sizes
            .AsParallel()  // Паралельне виконання для підвищення продуктивності
            .Select(size =>
            {
                return Task.Run(() =>
                {
                    // Формуємо шлях до файлу конкретного розміру
                    var path = Path.Combine(dir, $"{size}_{name}");
                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }
                });
            })
            .ToArray();

        // Чекаємо завершення всіх задач видалення
        await Task.WhenAll(tasks);
    }

    /// <summary>
    /// Зберігає зображення з URL адреси
    /// </summary>
    /// <param name="imageUrl">URL адреса зображення</param>
    /// <returns>Назва збереженого файлу</returns>
    public async Task<string> SaveImageFromUrlAsync(string imageUrl)
    {
        // Завантажуємо зображення з URL
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
        
        // Зберігаємо завантажені байти як зображення
        return await SaveImageAsync(imageBytes);
    }

    /// <summary>
    /// Зберігає зображення з завантаженого файлу (IFormFile)
    /// </summary>
    /// <param name="file">Завантажений файл зображення</param>
    /// <returns>Назва збереженого файлу</returns>
    public async Task<string> SaveImageAsync(IFormFile file)
    {
        // Конвертуємо файл в масив байтів
        using MemoryStream ms = new();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        // Зберігаємо зображення з байтів
        var imageName = await SaveImageAsync(bytes);
        return imageName;
    }

    /// <summary>
    /// Приватний метод для збереження зображення з масиву байтів
    /// </summary>
    /// <param name="bytes">Масив байтів зображення</param>
    /// <returns>Назва збереженого файлу</returns>
    private async Task<string> SaveImageAsync(byte[] bytes)
    {
        // Генеруємо унікальну назву файлу з розширенням .webp
        string imageName = $"{Path.GetRandomFileName()}.webp";
        
        // Отримуємо список розмірів для створення варіантів зображення
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();

        // Створюємо зображення у всіх розмірах паралельно
        Task[] tasks = sizes
            .AsParallel()  // Паралельне виконання для швидкості
            .Select(s => SaveImageAsync(bytes, imageName, s))
            .ToArray();

        // Чекаємо завершення всіх задач створення зображень
        await Task.WhenAll(tasks);

        return imageName;
    }

    /// <summary>
    /// Зберігає зображення з Base64 рядка
    /// </summary>
    /// <param name="input">Base64 рядок зображення</param>
    /// <returns>Назва збереженого файлу</returns>
    public async Task<string> SaveImageFromBase64Async(string input)
    {
        // Видаляємо префікс "data:image/..." якщо він є
        var base64Data = input.Contains(",")
           ? input.Substring(input.IndexOf(",") + 1)
           : input;

        // Конвертуємо Base64 в масив байтів
        byte[] imageBytes = Convert.FromBase64String(base64Data);

        // Зберігаємо зображення
        return await SaveImageAsync(imageBytes);
    }

    /// <summary>
    /// Приватний метод для збереження зображення у конкретному розмірі
    /// </summary>
    /// <param name="bytes">Масив байтів оригінального зображення</param>
    /// <param name="name">Назва файлу</param>
    /// <param name="size">Розмір для зміни масштабу</param>
    /// <returns>Task для асинхронної операції</returns>
    private async Task SaveImageAsync(byte[] bytes, string name, int size)
    {
        // Формуємо шлях до файлу з префіксом розміру
        var path = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!,
            $"{size}_{name}");
            
        // Завантажуємо зображення з байтів
        using var image = Image.Load(bytes);
        
        // Змінюємо розмір зображення
        image.Mutate(imgConext =>
        {
            imgConext.Resize(new ResizeOptions
            {
                Size = new Size(size, size),  // Квадратний розмір
                Mode = ResizeMode.Max         // Зберігаємо пропорції
            });
        });
        
        // Зберігаємо зображення у форматі WebP
        await image.SaveAsync(path, new WebpEncoder());
    }
}