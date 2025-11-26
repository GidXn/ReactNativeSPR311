using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

//Категорія заміток
[Table("tblNoteCategories")]
public class NoteCategoryEntity
{
    [Key]
    public long Id { get; set; }
    [Required, StringLength(255)]
    public string Name { get; set; } = null!;
    public bool IsDeleted { get; set; }

    [Required, StringLength(150)]
    public string Image { get; set; } = null!;
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(User))]
    public long UserId { get; set; }
    public virtual UserEntity? User { get; set; }
}
