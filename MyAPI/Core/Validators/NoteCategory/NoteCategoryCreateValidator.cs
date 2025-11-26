using Core.Models.NoteCategory;
using FluentValidation;

namespace Core.Validators.NoteCategory;

public class NoteCategoryCreateValidator : AbstractValidator<NoteCategoryCreateModel>
{
    public NoteCategoryCreateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Вкажіть назву категорії.")
            .MaximumLength(100).WithMessage("Максимальна доажина не більше 250 символів.");

        RuleFor(x => x.Image)
            .NotEmpty().WithMessage("Вкажіть фото категорії.");
    }
}
