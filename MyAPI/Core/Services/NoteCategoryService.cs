using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.NoteCategory;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class NoteCategoryService(IAuthService authService, 
    AppDbContext appDbContext,
    IImageService imageService,
    IMapper mapper) : INoteCategoryService
{
    public async Task<NoteCategoryItemModel> Create(NoteCategoryCreateModel model)
    {
        var userId = await authService.GetUserIdAsync();
        var entity = mapper.Map<NoteCategoryEntity>(model);
        entity.UserId = userId;
        if (model.Image is not null)
        {
            entity.Image = await imageService.SaveImageAsync(model.Image);
        }
        appDbContext.NoteCategories.Add(entity);
        await appDbContext.SaveChangesAsync();

        var result = mapper.Map<NoteCategoryItemModel>(entity);
        return result;
    }

    public async Task<List<NoteCategoryItemModel>> List()
    {
        var user = await authService.GetUserIdAsync();

        var list = await appDbContext.NoteCategories
            .Where(x => x.UserId == user)
            .ProjectTo<NoteCategoryItemModel>(mapper.ConfigurationProvider)
            .ToListAsync() ?? new List<NoteCategoryItemModel>();

        return list;
    }
}
