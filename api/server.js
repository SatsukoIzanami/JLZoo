// API/server.js

//Express REST API for zoo animals

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'animals.json');

const app = express();

const allowed = [
  'https://satsukoizanami.github.io',
  'https://satsukoizanami.github.io/JLZoo'
];
app.use(cors({ origin: allowed }));

app.use(express.json({ limit: '4mb '}));
api.use(express.urlencoded({ extended: true, limit: '4mb' }));

app.use((req, _res, next) => {
  console.log('req method:', req.method,
              'content-type:', req.headers['content-type'],
              'content-length:', req.headers['content-length']);
  next();
});


app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// load animals from animals.json and return array
async function loadAnimals() {
    const raw = await fsp.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed.animals) ? parsed.animals : [];

    // animal id?
    for (const a of arr) if (!a.id) a.id = randomUUID();
    return arr;
}

// save array back to animals.json
async function saveAnimals(animalArray) {
    const toWrite = { animals: animalArray };
    await fsp.writeFile(DATA_FILE, JSON.stringify(toWrite, null, 2), 'utf8');
}

// validation
function validateAnimal(payload, { partial = false } = {}) {
    const required = ['name', 'type', 'conservationStatus', 'habitat', 'description', 'image'];
    if (!partial) {
        for (const k of required) {
            if (!payload || typeof payload[k] !== 'string' || payload[k].trim() === '') {
                return `Field "${k}" is required and must be a non-empty string.`;
            }
        }
    } else {
        // for partial updates/prenancy
        for (const [k, v] of Object.entries(payload || {})) {
            if (k === 'pregnant') {
                if (typeof v !== 'boolean') return `"pregnant" must be boolean.`;
            } else if (typeof v !== 'string') {
                return `Field "${k} must be a string if provided.`;
            }
        }
    }
    return null;
}

// GET /animals
app.get('/api/animals', async (request, result) => {
    try {
        const animals = await loadAnimals();
        result.json(animals);
    } catch (err) {
        console.error(err);
        result.status(500).json({ error: 'Failed to read animals.' });
    }
});

// GET /animals/:id
app.get('/api/animals/:id', async (request, result) => {
    try {
        const animals = await loadAnimals();
        const found = animals.find(a => a.id === request.params.id);
        if (!found) return result.status(404).json({ error: 'Animal not found.' });
        result.json(found);
    } catch (err) {
        console.error(err);
        result.status(500).json({ error: 'Failed to read animal.' });
    }
});

// POST /animals
app.post('/api/animals', async (request, result) => {
    try {
        const error = validateAnimal(request.body);
        if (error) return result.status(400).json({ error });

        const animals = await loadAnimals();
        const newAnimal = {
            id: randomUUID(),
            name: request.body.name.trim(),
            type: request.body.type.trim(),
            conservationStatus: request.body.conservationStatus.trim(),
            habitat: request.body.habitat.trim(),
            image: request.body.image.trim() || 'images/comingSoon.png',
            description: request.body.description.trim(),
            funFact: (request.body.funFact || '').toString(),
            pregnant: Boolean(request.body.pregnant)
        };
        animals.push(newAnimal);
        await saveAnimals(animals);
        result.status(201).json(newAnimal);
    } catch (err) {
        console.error(err);
        result.status(500).json({ error: 'Failed to create animal.'});
    }
});

// PUT /animals/:id
app.put('/api/animals/:id', async (request, result) => {
    try {
        const error = validateAnimal(request.body);
        if (error) return result.status(400).json({ error });

        const animals = await loadAnimals();
        const idx = animals.findIndex(a => a.id === request.params.id);
        if (idx === -1) return result.status(404).json({ error: 'Animal not found.' });

        const updated = {
            ...animals[idx],
            name: request.body.name.trim(),
            type: request.body.type.trim(),
            conservationStatus: request.body.conservationStatus.trim(),
            habitat: request.body.habitat.trim(),
            image: request.body.image.trim() || 'images/comingSoon.png',
            description: request.body.description.trim(),
            funFact: (request.body.funFact || '').toString(),
            pregnant: Boolean(request.body.pregnant)
        };

        animals[idx] = updated;
        await saveAnimals(animals);
        result.json(updated);
    } catch (err) {
        console.error(err);
        result.status(500).json({ error: 'Failed to update animal.'});
    }
});

// PATCH /animals/:id
app.patch('/api/animals/:id', async (request, result) => {
    try {
        const error = validateAnimal(request.body, { partial: true });
        if (error) return result.status(400).json({ error });

        const animals = await loadAnimals();
        const idx = animals.findIndex(a => a.id === request.params.id);
        if (idx === -1) return result.status(404).json({ error: 'Animal not found.' });

        const current = animals[idx];
        const merged = { ...current, ...request.body };
        animals[idx] = merged;
        await saveAnimals(animals);
        result.json(merged);
    } catch (err) {
        console.error(err);
        result.status(500).json({ error: 'Failed to patch animal.'});
    }
});

// DELETE /animals/:id
app.delete('/api/animals/:id', async (request, result) => {
    try {
        const animals = await loadAnimals();
        const idx = animals.findIndex(a => a.id === request.params.id);
        if (idx === -1) return result.status(404).json({ error: 'Animal not found.'});

        const removed = animals.splice(idx, 1)[0];
        await saveAnimals(animals);
        result.json(removed);
    } catch (err) {
        console.error(err);
        result.status(500).json({ error: 'Failed to delete animal.'});
    }
});

app.listen(PORT, () => {
    console.log(`Zoo API listening on :${PORT}`);
});