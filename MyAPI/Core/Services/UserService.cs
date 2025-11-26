using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Account;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class UserService(AppDbContext appDbContext,
    IMapper mapper) : IUserService
{
    public async Task<UserProfileModel> GetUserByIdAsync(long userId)
    {
        var user = await appDbContext
            .Users
            .Where(x=>x.Id == userId)
            .ProjectTo<UserProfileModel>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        return user!;
    }
}
