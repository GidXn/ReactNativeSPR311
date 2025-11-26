using Core.Models.NoteCategory;

namespace Core.Interfaces;

public interface INoteCategoryService
{
    Task<List<NoteCategoryItemModel>> List();
    Task<NoteCategoryItemModel> Create(NoteCategoryCreateModel model);
}
