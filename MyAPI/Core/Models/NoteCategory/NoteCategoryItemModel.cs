namespace Core.Models.NoteCategory;

public class NoteCategoryItemModel
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Image { get; set; } = null!;
    public string DateCreated { get; set; } = null!;
}
