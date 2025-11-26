using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

// Пости користувача
[Table("tblPosts")]
public class PostEntity
{
    [Key]
    public long Id { get; set; }

    [Required, StringLength(255)]
    public string Title { get; set; } = null!;

    [Required]
    public string Content { get; set; } = null!;

    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(User))]
    public long UserId { get; set; }
    public virtual UserEntity? User { get; set; }
}


