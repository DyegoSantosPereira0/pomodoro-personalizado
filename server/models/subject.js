const db = require('../database/db');

class Subject {
    static getAll(callback) {
        db.all('SELECT * FROM subjects', callback);
    }

    static getById(id, callback) {
        db.get('SELECT * FROM subjects WHERE id = ?', [id], callback);
    }

    static create(name, percentage, callback) {
        db.run(
            'INSERT INTO subjects (name, percentage) VALUES (?, ?)',
            [name, percentage],
            function(err) {
                callback(err, this.lastID);
            }
        );
    }

    static update(id, name, percentage, callback) {
        db.run(
            'UPDATE subjects SET name = ?, percentage = ? WHERE id = ?',
            [name, percentage, id],
            callback
        );
    }

    static delete(id, callback) {
        db.run('DELETE FROM subjects WHERE id = ?', [id], callback);
    }
}

module.exports = Subject;