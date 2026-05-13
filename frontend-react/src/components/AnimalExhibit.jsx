import { useEffect, useMemo, useState } from "react";
import { createAnimal, getAnimals } from "../services/zooData";
import AdoptionDialog from "./AdoptionDialog.jsx";
import { useAdoptionState } from "../hooks/useAdoptionState";
import "./AnimalExhibit.css";

const emptyAnimalForm = {
  species: "",
  class: "",
  conservationStatus: "",
  habitat: "",
  img: "",
  description: "",
  more: "",
};

export default function AnimalExhibit() {
  const [animals, setAnimals] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadError, setLoadError] = useState("");
  const [addForm, setAddForm] = useState(emptyAnimalForm);
  const [formTouched, setFormTouched] = useState({});
  const [adoptAnimal, setAdoptAnimal] = useState(null);
  const [toast, setToast] = useState("");
  const adoption = useAdoptionState();

  useEffect(() => {
    loadAnimals();
  }, []);

  const selectedAnimal = useMemo(
    () => animals.find((animal) => animal.name === selectedName) ?? null,
    [animals, selectedName]
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return animals.filter((animal) =>
      [animal.name, animal.type, animal.habitat, animal.conservationStatus].some(
        (value) => String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [animals, searchQuery]);

  const addErrors = useMemo(
    () => ({
      species: addForm.species.trim().length >= 2 ? "" : "Species is required.",
      class: addForm.class.trim().length >= 2 ? "" : "Class is required.",
      conservationStatus: addForm.conservationStatus.trim() ? "" : "Status is required.",
      habitat: addForm.habitat.trim().length >= 2 ? "" : "Habitat is required.",
      description:
        addForm.description.trim().length >= 10
          ? ""
          : "Description must be at least 10 characters.",
    }),
    [addForm]
  );

  async function loadAnimals() {
    try {
      const list = await getAnimals();
      setAnimals(list);
      setLoadError("");
    } catch {
      setLoadError("Could not load animals.");
      setAnimals([]);
    }
  }

  function showToast(message, duration = 3000) {
    setToast(message);
    window.setTimeout(() => setToast(""), duration);
  }

  function handleAdoptionSave(result) {
    if (!adoptAnimal) return;
    adoption.adopt(adoptAnimal.name, result.phone, result.customName);
    showToast(`${adoption.displayName(adoptAnimal.name)} adopted successfully!`);
    setAdoptAnimal(null);
  }

  function updateAddForm(event) {
    const { name, value } = event.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submitAnimal(event) {
    event.preventDefault();
    setFormTouched({
      species: true,
      class: true,
      conservationStatus: true,
      habitat: true,
      description: true,
    });

    if (Object.values(addErrors).some(Boolean)) {
      return;
    }

    const payload = {
      name: addForm.species.trim(),
      type: addForm.class.trim(),
      conservationStatus: addForm.conservationStatus.trim(),
      habitat: addForm.habitat.trim(),
      description: addForm.description.trim(),
      image: addForm.img.trim() || "images/comingSoon.png",
      funFact: addForm.more.trim() || undefined,
    };

    try {
      await createAnimal(payload);
      await loadAnimals();
      showToast("Animal added to the zoo!");
      setAddForm(emptyAnimalForm);
      setFormTouched({});
    } catch {
      showToast("Error: could not save animal.", 4000);
    }
  }

  return (
    <div className="exhibit-wrapper">
      <section className="panel">
        <h2>Browse by Animal</h2>
        <label htmlFor="animalSelect">Animal</label>
        <select id="animalSelect" value={selectedName} onChange={(event) => setSelectedName(event.target.value)}>
          <option value="">- Select an Animal -</option>
          {animals.map((animal) => (
            <option key={animal.name} value={animal.name}>
              {animal.name}
            </option>
          ))}
        </select>

        {selectedAnimal ? (
          <div className="animal-card card-container">
            <img src={selectedAnimal.image} alt={selectedAnimal.name} />
            <h3>
              {adoption.displayName(selectedAnimal.name)}
              {adoption.isAdopted(selectedAnimal.name) ? (
                <span className="adopted-badge">✓ Adopted</span>
              ) : null}
            </h3>
            <p>Class: {selectedAnimal.type}</p>
            <p>Status: {selectedAnimal.conservationStatus}</p>
            <p>Habitat: {selectedAnimal.habitat}</p>
            <p>{selectedAnimal.description}</p>
            {selectedAnimal.funFact ? (
              <details>
                <summary>Show Fun Fact</summary>
                <p>
                  <strong>Fun Fact:</strong> {selectedAnimal.funFact}
                </p>
              </details>
            ) : null}
            <div className="row card-actions">
              <button
                type="button"
                disabled={adoption.isAdopted(selectedAnimal.name)}
                onClick={() => setAdoptAnimal(selectedAnimal)}
              >
                {adoption.isAdopted(selectedAnimal.name) ? "Already Adopted" : "Adopt"}
              </button>
            </div>
          </div>
        ) : null}

        {loadError ? <p className="muted">{loadError}</p> : null}
      </section>

      <section className="panel">
        <h2>Adopted Animals</h2>
        <ul className="adopted-list">
          {adoption.records.length === 0 ? <li className="muted">No adopted animals yet.</li> : null}
          {adoption.records.map((record) => (
            <li key={record.displayName}>
              <div className="adopt-info">
                <span>{record.displayName}</span>
                <span className="adopt-phone">
                  Phone: {adoption.contactByDisplayName(record.displayName)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => adoption.removeByDisplayName(record.displayName)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Search the Zoo</h2>
        <input
          className="search-field"
          type="search"
          value={searchQuery}
          placeholder="Search by name or class"
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <ul className="results-list">
          {searchQuery.trim() && searchResults.length === 0 ? <li className="muted">No matches</li> : null}
          {searchResults.map((animal) => (
            <li key={animal.name} onClick={() => setSelectedName(animal.name)}>
              {animal.name} ({animal.type})
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Add an Animal</h2>
        <form className="form-add" onSubmit={submitAnimal} noValidate>
          <div className="field">
            <label htmlFor="species">Species *</label>
            <input
              id="species"
              name="species"
              value={addForm.species}
              onBlur={() => setFormTouched((prev) => ({ ...prev, species: true }))}
              onChange={updateAddForm}
            />
            {formTouched.species && addErrors.species ? (
              <p className="field-error">{addErrors.species}</p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="class">Class *</label>
            <input
              id="class"
              name="class"
              value={addForm.class}
              onBlur={() => setFormTouched((prev) => ({ ...prev, class: true }))}
              onChange={updateAddForm}
            />
            {formTouched.class && addErrors.class ? <p className="field-error">{addErrors.class}</p> : null}
          </div>
          <div className="field">
            <label htmlFor="conservationStatus">Conservation Status *</label>
            <select
              id="conservationStatus"
              name="conservationStatus"
              value={addForm.conservationStatus}
              onBlur={() => setFormTouched((prev) => ({ ...prev, conservationStatus: true }))}
              onChange={updateAddForm}
            >
              <option value="">- Select status -</option>
              <option value="Least Concern">Least Concern</option>
              <option value="Near Threatened">Near Threatened</option>
              <option value="Vulnerable">Vulnerable</option>
              <option value="Endangered">Endangered</option>
              <option value="Critically Endangered">Critically Endangered</option>
            </select>
            {formTouched.conservationStatus && addErrors.conservationStatus ? (
              <p className="field-error">{addErrors.conservationStatus}</p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="habitat">Habitat *</label>
            <input
              id="habitat"
              name="habitat"
              value={addForm.habitat}
              onBlur={() => setFormTouched((prev) => ({ ...prev, habitat: true }))}
              onChange={updateAddForm}
            />
            {formTouched.habitat && addErrors.habitat ? (
              <p className="field-error">{addErrors.habitat}</p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="img">Image URL</label>
            <input
              id="img"
              name="img"
              type="url"
              placeholder="https://..."
              value={addForm.img}
              onChange={updateAddForm}
            />
          </div>
          <div className="field field-span-2">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={addForm.description}
              onBlur={() => setFormTouched((prev) => ({ ...prev, description: true }))}
              onChange={updateAddForm}
            />
            {formTouched.description && addErrors.description ? (
              <p className="field-error">{addErrors.description}</p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="more">Fun Fact</label>
            <input id="more" name="more" value={addForm.more} onChange={updateAddForm} />
          </div>
          <div className="row form-actions field-span-2">
            <button type="submit">Add to Zoo</button>
            <button type="button" onClick={() => setAddForm(emptyAnimalForm)}>
              Reset
            </button>
          </div>
        </form>
      </section>

      {adoptAnimal ? (
        <AdoptionDialog
          animal={adoptAnimal}
          onClose={() => setAdoptAnimal(null)}
          onSave={handleAdoptionSave}
        />
      ) : null}

      {toast ? <p className="toast-message">{toast}</p> : null}
    </div>
  );
}
