const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');

// Obter todas as matérias
router.get('/', (req, res) => {
    Subject.getAll((err, subjects) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(subjects);
    });
});

// Criar nova matéria
router.post('/', (req, res) => {
    const { name, percentage } = req.body;
    
    if (!name || !percentage) {
        return res.status(400).json({ error: 'Nome e porcentagem são obrigatórios' });
    }

    Subject.create(name, percentage, (err, id) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id, name, percentage });
    });
});

// Atualizar matéria
router.put('/:id', (req, res) => {
    const { name, percentage } = req.body;
    const { id } = req.params;

    Subject.update(id, name, percentage, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id, name, percentage });
    });
});

// Excluir matéria
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Subject.delete(id, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Matéria excluída com sucesso' });
    });
});

module.exports = router;