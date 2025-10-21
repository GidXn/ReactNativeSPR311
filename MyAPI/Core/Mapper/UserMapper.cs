using AutoMapper;
using Core.Models.Seeder;
using Domain.Entities.Identity;

namespace Core.Mapper;

/// <summary>
/// Профіль AutoMapper для маппінгу між моделями користувачів
/// Визначає правила конвертації між різними типами моделей користувачів
/// </summary>
public class UserMapper : Profile
{
    /// <summary>
    /// Конструктор профілю маппінгу
    /// </summary>
    public UserMapper()
    {
        // Налаштовуємо маппінг з SeederUserModel в UserEntity
        CreateMap<SeederUserModel, UserEntity>()
            // Встановлюємо UserName = Email для Identity системи
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));
    }
}
