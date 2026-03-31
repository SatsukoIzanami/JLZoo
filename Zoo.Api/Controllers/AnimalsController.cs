using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zoo.Api.Data;
using Zoo.Api.Entities;
using Zoo.Api.Models;
using Zoo.Api.Services;

namespace Zoo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnimalsController(ZooDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AnimalApiModel>>> GetAll(CancellationToken ct)
    {
        var list = await db.Animals.AsNoTracking().OrderBy(a => a.Name).ToListAsync(ct);
        return Ok(list.Select(AnimalApiModel.FromEntity));
    }

    [HttpGet("{name}")]
    public async Task<ActionResult<AnimalApiModel>> GetByName(string name, CancellationToken ct)
    {
        var found = await FindByName(name, ct);
        if (found is null)
            return NotFound(new { error = "Animal not found." });
        return Ok(AnimalApiModel.FromEntity(found));
    }

    [HttpPost]
    public async Task<ActionResult<AnimalApiModel>> Create([FromBody] AnimalApiModel body, CancellationToken ct)
    {
        var err = AnimalValidation.ValidateFull(body);
        if (err is not null)
            return BadRequest(new { error = err });

        var exists = await db.Animals.AnyAsync(
            a => a.Name.ToLower() == body.Name.Trim().ToLower(),
            ct);
        if (exists)
            return Conflict(new { error = "Animal already exists." });

        var entity = new Animal
        {
            Name = body.Name.Trim(),
            Type = body.Type.Trim(),
            ConservationStatus = body.ConservationStatus.Trim(),
            Habitat = body.Habitat.Trim(),
            Image = string.IsNullOrWhiteSpace(body.Image.Trim()) ? "images/comingSoon.png" : body.Image.Trim(),
            Description = body.Description.Trim(),
            FunFact = body.FunFact?.Trim() ?? "",
            Pregnant = body.Pregnant,
        };

        db.Animals.Add(entity);
        await db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetByName), new { name = entity.Name }, AnimalApiModel.FromEntity(entity));
    }

    [HttpPut("{name}")]
    public async Task<ActionResult<AnimalApiModel>> Replace(string name, [FromBody] AnimalApiModel body, CancellationToken ct)
    {
        var err = AnimalValidation.ValidateFull(body);
        if (err is not null)
            return BadRequest(new { error = err });

        var entity = await FindByName(name, ct);
        if (entity is null)
            return NotFound(new { error = "Animal not found." });

        var nameTaken = await db.Animals.AnyAsync(
            a => a.Id != entity.Id && a.Name.ToLower() == body.Name.Trim().ToLower(),
            ct);
        if (nameTaken)
            return Conflict(new { error = "Animal already exists." });

        entity.Name = body.Name.Trim();
        entity.Type = body.Type.Trim();
        entity.ConservationStatus = body.ConservationStatus.Trim();
        entity.Habitat = body.Habitat.Trim();
        entity.Image = string.IsNullOrWhiteSpace(body.Image.Trim()) ? "images/comingSoon.png" : body.Image.Trim();
        entity.Description = body.Description.Trim();
        entity.FunFact = body.FunFact?.Trim() ?? "";
        entity.Pregnant = body.Pregnant;

        await db.SaveChangesAsync(ct);
        return Ok(AnimalApiModel.FromEntity(entity));
    }

    [HttpPatch("{name}")]
    public async Task<ActionResult<AnimalApiModel>> Patch(string name, [FromBody] AnimalPatchModel body, CancellationToken ct)
    {
        var entity = await FindByName(name, ct);
        if (entity is null)
            return NotFound(new { error = "Animal not found." });

        if (body.Name is not null) entity.Name = body.Name;
        if (body.Type is not null) entity.Type = body.Type;
        if (body.ConservationStatus is not null) entity.ConservationStatus = body.ConservationStatus;
        if (body.Habitat is not null) entity.Habitat = body.Habitat;
        if (body.Description is not null) entity.Description = body.Description;
        if (body.Image is not null)
            entity.Image = string.IsNullOrWhiteSpace(body.Image.Trim()) ? "images/comingSoon.png" : body.Image.Trim();
        if (body.FunFact is not null) entity.FunFact = body.FunFact;
        if (body.Pregnant is not null) entity.Pregnant = body.Pregnant.Value;

        await db.SaveChangesAsync(ct);
        return Ok(AnimalApiModel.FromEntity(entity));
    }

    [HttpDelete("{name}")]
    public async Task<ActionResult<AnimalApiModel>> Delete(string name, CancellationToken ct)
    {
        var entity = await FindByName(name, ct);
        if (entity is null)
            return NotFound(new { error = "Animal not found." });

        var copy = AnimalApiModel.FromEntity(entity);
        db.Animals.Remove(entity);
        await db.SaveChangesAsync(ct);
        return Ok(copy);
    }

    private Task<Animal?> FindByName(string name, CancellationToken ct) =>
        db.Animals.FirstOrDefaultAsync(a => a.Name.ToLower() == name.ToLower(), ct);
}
