using Zoo.Api.Entities;

namespace Zoo.Api.Models;

public class AnimalApiModel
{
    public string Name { get; set; } = "";
    public string Type { get; set; } = "";
    public string ConservationStatus { get; set; } = "";
    public string Habitat { get; set; } = "";
    public string Description { get; set; } = "";
    public string Image { get; set; } = "";
    public string? FunFact { get; set; }
    public bool Pregnant { get; set; }

    public static AnimalApiModel FromEntity(Animal a) =>
        new()
        {
            Name = a.Name,
            Type = a.Type,
            ConservationStatus = a.ConservationStatus,
            Habitat = a.Habitat,
            Description = a.Description,
            Image = a.Image,
            FunFact = a.FunFact,
            Pregnant = a.Pregnant,
        };
}

public class AnimalPatchModel
{
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? ConservationStatus { get; set; }
    public string? Habitat { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string? FunFact { get; set; }
    public bool? Pregnant { get; set; }
}
