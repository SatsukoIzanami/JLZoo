using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Zoo.Api.Entities;

[Table("animals")]
public class Animal
{
    [Column("id")]
    public int Id { get; set; }

    [Column("type")]
    [MaxLength(50)]
    public string Type { get; set; } = null!;

    [Column("name")]
    [MaxLength(120)]
    public string Name { get; set; } = null!;

    [Column("conservation_status")]
    [MaxLength(60)]
    public string ConservationStatus { get; set; } = null!;

    [Column("habitat")]
    [MaxLength(120)]
    public string Habitat { get; set; } = null!;

    [Column("description")]
    public string Description { get; set; } = null!;

    [Column("image")]
    [MaxLength(255)]
    public string Image { get; set; } = null!;

    [Column("fun_fact")]
    public string FunFact { get; set; } = null!;

    [Column("pregnant")]
    public bool Pregnant { get; set; }
}
