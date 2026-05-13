import AnimalExhibit from "../components/AnimalExhibit.jsx";

export default function HomePage() {
  return (
    <>
      <p id="welcome">
        Discover a world of wonder at JL Zoo, where you'll encounter a diverse array of fascinating animals in
        their natural habitats. From majestic lions and playful monkeys to exotic birds and reptiles, our zoo
        offers unforgettable experiences for all ages. Explore our interactive exhibits, learn about conservation
        efforts, and create lasting memories with your family.
      </p>
      <section className="container">
        <AnimalExhibit />
      </section>
    </>
  );
}
