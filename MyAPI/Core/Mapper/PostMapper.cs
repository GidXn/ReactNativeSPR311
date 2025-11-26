using AutoMapper;
using Core.Models.Post;
using Domain.Entities;
using System.Globalization;

namespace Core.Mapper;

public class PostMapper : Profile
{
    public PostMapper()
    {
        CreateMap<PostCreateModel, PostEntity>();

        CreateMap<PostEntity, PostItemModel>()
            .ForMember(opt => opt.DateCreated, opt =>
                opt.MapFrom(x => x.DateCreated.ToString("dd.MM.yyyy HH:mm:ss",
                    new CultureInfo("uk"))));
    }
}


