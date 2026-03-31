using Microsoft.EntityFrameworkCore;
using Zoo.Api.Entities;

namespace Zoo.Api.Data;

public class ZooDbContext(DbContextOptions<ZooDbContext> options) : DbContext(options)
{
    public DbSet<Animal> Animals => Set<Animal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Animal>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
        });
    }
}
