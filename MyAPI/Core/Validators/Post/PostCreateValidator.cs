using Core.Models.Post;
using FluentValidation;

namespace Core.Validators.Post;

public class PostCreateValidator : AbstractValidator<PostCreateModel>
{
    public PostCreateValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Вкажіть заголовок поста.")
            .MaximumLength(255).WithMessage("Максимальна довжина заголовка 255 символів.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Вкажіть текст поста.");
    }
}


