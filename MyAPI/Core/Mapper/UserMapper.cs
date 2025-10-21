using AutoMapper;
using Core.Models.Seeder;
using Domain.Entities.Identity;

namespace Core.Mapper;

/// <summary>
/// Профіль AutoMapper для маппінгу користувачів
/// AutoMapper - бібліотека для автоматичного перетворення об'єктів одного типу в інший
/// </summary>
public class UserMapper : Profile
{
    /// <summary>
    /// Конструктор профілю маппінгу
    /// Тут визначаються правила перетворення між моделями та сутностями
    /// </summary>
    public UserMapper()
    {
        // Налаштування маппінгу з SeederUserModel на UserEntity
        CreateMap<SeederUserModel, UserEntity>()
            // Встановлюємо UserName рівним Email (це вимога Identity)
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));
    }
}
