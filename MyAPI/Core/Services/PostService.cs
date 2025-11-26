using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Post;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class PostService(IAuthService authService,
    AppDbContext appDbContext,
    IMapper mapper) : IPostService
{
    public async Task<PostItemModel> Create(PostCreateModel model)
    {
        var userId = await authService.GetUserIdAsync();
        var entity = mapper.Map<PostEntity>(model);
        entity.UserId = userId;

        appDbContext.Posts.Add(entity);
        await appDbContext.SaveChangesAsync();

        var result = mapper.Map<PostItemModel>(entity);
        return result;
    }

    public async Task<List<PostItemModel>> List()
    {
        var userId = await authService.GetUserIdAsync();

        var list = await appDbContext.Posts
            .Where(x => x.UserId == userId)
            .ProjectTo<PostItemModel>(mapper.ConfigurationProvider)
            .ToListAsync() ?? new List<PostItemModel>();

        return list;
    }
}


