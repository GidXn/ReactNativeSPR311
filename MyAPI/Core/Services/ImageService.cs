using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using Core.Interfaces;

namespace Core.Services;

/// <summary>
/// Сервіс для роботи з зображеннями
/// Підтримує збереження, видалення та обробку зображень у різних розмірах
/// Використовує SixLabors.ImageSharp для обробки зображень
/// </summary>
public class ImageService(IConfiguration configuration) : IImageService
{
    /// <summary>
    /// Видаляє зображення у всіх розмірах
    /// </summary>
    /// <param name="name">Ім'я файлу зображення</param>
    public async Task DeleteImageAsync(string name)
    {
        // Отримуємо список розмірів зображень з конфігурації
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();
        var dir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!);

        // Створюємо масив задач для паралельного видалення файлів
        // AsParallel() дозволяє виконувати операції паралельно для підвищення продуктивності
        Task[] tasks = sizes
            .AsParallel()
            .Select(size =>
            {
                return Task.Run(() =>
                {
                    var path = Path.Combine(dir, $"{size}_{name}");
                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }
                });
            })
            .ToArray();

        // Чекаємо завершення всіх задач
        await Task.WhenAll(tasks);
    }

    /// <summary>
    /// Зберігає зображення з URL адреси
    /// </summary>
    /// <param name="imageUrl">URL адреса зображення</param>
    /// <returns>Ім'я збереженого файлу</returns>
    public async Task<string> SaveImageFromUrlAsync(string imageUrl)
    {
        // Використовуємо HttpClient для завантаження зображення з інтернету
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
        return await SaveImageAsync(imageBytes);
    }

    /// <summary>
    /// Зберігає зображення з файлу, завантаженого через форму
    /// </summary>
    /// <param name="file">Файл зображення з HTTP запиту</param>
    /// <returns>Ім'я збереженого файлу</returns>
    public async Task<string> SaveImageAsync(IFormFile file)
    {
        // Конвертуємо файл у масив байтів
        using MemoryStream ms = new();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        var imageName = await SaveImageAsync(bytes);
        return imageName;
    }

    /// <summary>
    /// Приватний метод для збереження зображення у всіх розмірах
    /// </summary>
    /// <param name="bytes">Масив байтів зображення</param>
    /// <returns>Ім'я збереженого файлу</returns>
    private async Task<string> SaveImageAsync(byte[] bytes)
    {
        // Генеруємо унікальне ім'я файлу з розширенням .webp
        string imageName = $"{Path.GetRandomFileName()}.webp";
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();

        // Створюємо задачі для паралельного збереження зображень у різних розмірах
        Task[] tasks = sizes
            .AsParallel()
            .Select(s => SaveImageAsync(bytes, imageName, s))
            .ToArray();

        // Чекаємо завершення всіх задач
        await Task.WhenAll(tasks);

        return imageName;
    }

    /// <summary>
    /// Зберігає зображення з Base64 рядка
    /// </summary>
    /// <param name="input">Base64 рядок зображення</param>
    /// <returns>Ім'я збереженого файлу</returns>
    public async Task<string> SaveImageFromBase64Async(string input)
    {
        // Обробляємо Base64 рядок - видаляємо префікс data:image/...;base64, якщо він є
        var base64Data = input.Contains(",")
           ? input.Substring(input.IndexOf(",") + 1)
           : input;

        // Конвертуємо Base64 у масив байтів
        byte[] imageBytes = Convert.FromBase64String(base64Data);

        return await SaveImageAsync(imageBytes);
    }

    /// <summary>
    /// Приватний метод для збереження зображення у конкретному розмірі
    /// </summary>
    /// <param name="bytes">Масив байтів зображення</param>
    /// <param name="name">Ім'я файлу</param>
    /// <param name="size">Розмір зображення (ширина та висота)</param>
    private async Task SaveImageAsync(byte[] bytes, string name, int size)
    {
        // Формуємо шлях до файлу з префіксом розміру
        var path = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!,
            $"{size}_{name}");
        
        // Завантажуємо зображення з масиву байтів
        using var image = Image.Load(bytes);
        
        // Обробляємо зображення - змінюємо розмір
        image.Mutate(imgConext =>
        {
            imgConext.Resize(new ResizeOptions
            {
                Size = new Size(size, size),        // Встановлюємо квадратний розмір
                Mode = ResizeMode.Max              // Режим зміни розміру - зберігає пропорції
            });
        });
        
        // Зберігаємо зображення у форматі WebP
        await image.SaveAsync(path, new WebpEncoder());
    }
}