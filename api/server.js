// API/server.js

//Express REST API for zoo animals & static Vite front-end

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'animals.json');

const app = express();

const allowed = [
    'https://satsukoizanami.github.io',
    'https://satsukoizanami.github.io/JLZoo',
    'http://localhost:5173'
];
app.use(cors({ origin: allowed }));

app.use(express.json({ limit: '4mb', type: 'application/json'}));
app.use(express.urlencoded({ extended: true, limit: '4mb', type: 'application/x-www-form-urlencoded' }));

app.use((err, req, res, next) => {
    if (err && err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Payload too large' });
    }
    next(err);
});

// server vite build/dist statically
const distPath = path.join(__dirname, '../dist');
try {
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        console.log('Static front-end enabled from /dist');
    } else {
        console.warn('No /dist folder found. Run "npm run build" first for production.');
    }
} catch (err) {
    console.error('Error checking dist path:', err);
}


// load animals from animals.json and return array
async function loadAnimals() {
    const raw = await fsp.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed.animals) ? parsed.animals : [];
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
        result.status(500).json({ error: 'Failed to load animals.' });
    }
});

// GET /animals/:name
app.get('/api/animals/:name', async (request, result) => {
    try {
        const animals = await loadAnimals();
        const found = animals.find(a => a.name.toLowerCase() === request.params.name.toLowerCase());
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
        const exists = animals.some(a => a.name.toLowerCase() === req.body.name.toLowerCase());
        if (exists) return res.status(409).json({ error: 'Animal already exists.' });
        
        const newAnimal = {
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

// PUT /animals/:name
app.put('/api/animals/:name', async (request, result) => {
    try {
        const error = validateAnimal(request.body);
        if (error) return result.status(400).json({ error });

        const animals = await loadAnimals();
        const idx = animals.findIndex(a => a.name.toLowerCase() === request.params.name.toLowerCase());
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

// PATCH /animals/:name
app.patch('/api/animals/:name', async (request, result) => {
    try {
        const error = validateAnimal(request.body, { partial: true });
        if (error) return result.status(400).json({ error });

        const animals = await loadAnimals();
        const idx = animals.findIndex(a => a.name.toLowerCase() === request.params.name.toLowerCase());
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

// DELETE /animals/:name
app.delete('/api/animals/:name', async (request, result) => {
    try {
        const animals = await loadAnimals();
        const idx = animals.findIndex(a => a.name.toLowerCase() === request.params.name.toLowerCase());
        if (idx === -1) return result.status(404).json({ error: 'Animal not found.'});

        const removed = animals.splice(idx, 1)[0];
        await saveAnimals(animals);
        result.json(removed);
    } catch (err) {
        console.error(err);
        result.status(500).json({ error: 'Failed to delete animal.'});
    }
});

// send index.html for non-API route for user reload/manual nav
app.use((req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Not found');
    }
});

// start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Zoo API  & Frontend running on port ${PORT}`));
};

export default app;