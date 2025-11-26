using Core.Models.Post;

namespace Core.Interfaces;

public interface IPostService
{
    Task<List<PostItemModel>> List();
    Task<PostItemModel> Create(PostCreateModel model);
}


