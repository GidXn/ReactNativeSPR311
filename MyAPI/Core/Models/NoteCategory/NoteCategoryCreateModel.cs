using Microsoft.AspNetCore.Http;

namespace Core.Models.NoteCategory;

public class NoteCategoryCreateModel
{
    public string Name { get; set; } = null!;
    public IFormFile? Image { get; set; } = null!;
}
