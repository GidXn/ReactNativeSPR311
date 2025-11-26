using AutoMapper;
using Core.Models.NoteCategory;
using Domain.Entities;
using System.Globalization;

namespace Core.Mapper;

public class NoteCategoryMapper : Profile
{
    public NoteCategoryMapper()
    {
        CreateMap<NoteCategoryCreateModel, NoteCategoryEntity>()
            .ForMember(opt => opt.Image, opt => opt.Ignore());

        CreateMap<NoteCategoryEntity, NoteCategoryItemModel>()
            .ForMember(opt => opt.DateCreated, opt =>
                opt.MapFrom(x => x.DateCreated.ToString("dd.MM.yyyy HH:mm:ss",
                    new CultureInfo("uk"))));
    }
}
