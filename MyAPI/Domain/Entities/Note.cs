using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

// Замітка/задача користувача по категоріям
[Table("tblNotes")]
public class NoteEntity
{
    [Key]
    public long Id { get; set; }

    [Required, StringLength(255)]
    public string Title { get; set; } = null!;

    [StringLength(1000)]
    public string? Description { get; set; }

    // Чи виконана задача
    public bool IsDone { get; set; }

    // Планова дата виконання (необов'язково)
    public DateTime? PlannedAt { get; set; }

    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    // Зв'язок з користувачем
    [ForeignKey(nameof(User))]
    public long UserId { get; set; }
    public virtual UserEntity? User { get; set; }

    // Зв'язок з категорією
    [ForeignKey(nameof(Category))]
    public long CategoryId { get; set; }
    public virtual NoteCategoryEntity? Category { get; set; }
}


