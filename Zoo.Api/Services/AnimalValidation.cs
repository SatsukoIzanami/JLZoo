using Zoo.Api.Models;

namespace Zoo.Api.Services;

public static class AnimalValidation
{
    public static string? ValidateFull(AnimalApiModel body)
    {
        if (string.IsNullOrWhiteSpace(body.Name))
            return """Field "name" is required and must be a non-empty string.""";
        if (string.IsNullOrWhiteSpace(body.Type))
            return """Field "type" is required and must be a non-empty string.""";
        if (string.IsNullOrWhiteSpace(body.ConservationStatus))
            return """Field "conservationStatus" is required and must be a non-empty string.""";
        if (string.IsNullOrWhiteSpace(body.Habitat))
            return """Field "habitat" is required and must be a non-empty string.""";
        if (string.IsNullOrWhiteSpace(body.Description))
            return """Field "description" is required and must be a non-empty string.""";
        if (string.IsNullOrWhiteSpace(body.Image))
            return """Field "image" is required and must be a non-empty string.""";
        return null;
    }
}
