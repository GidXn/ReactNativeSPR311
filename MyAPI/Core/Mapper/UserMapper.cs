using AutoMapper;
using Core.Models.Account;
using Core.Models.Seeder;
using Domain.Entities.Identity;
using System.Globalization;

namespace Core.Mapper;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<SeederUserModel, UserEntity>()
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));

        CreateMap<RegisterModel, UserEntity>()
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));

        CreateMap<UserEntity, UserProfileModel>()
            .ForMember(opt => opt.FullName, opt => 
                opt.MapFrom(x => x.LastName + " "+x.FirstName))
            .ForMember(opt => opt.DateRegister, opt => 
                opt.MapFrom(x => x.DateCreated.ToString("dd.MM.yyyy HH:mm:ss",
                    new CultureInfo("uk"))))
            .ForMember(opt => opt.Roles, opt =>
                opt.MapFrom(x => x.UserRoles!.Select(ur=>ur.Role.Name).ToArray()));
    }
}
