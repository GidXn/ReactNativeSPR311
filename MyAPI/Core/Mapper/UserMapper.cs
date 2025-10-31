using AutoMapper;
using Core.Models.Account;
using Core.Models.Seeder;
using Domain.Entities.Identity;

namespace Core.Mapper;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<SeederUserModel, UserEntity>()
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));

        CreateMap<RegisterModel, UserEntity>()
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));
    }
}
