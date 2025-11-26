using Core.Models.Account;

namespace Core.Interfaces;

public interface IUserService
{
    Task<UserProfileModel> GetUserByIdAsync(long userId);
}
