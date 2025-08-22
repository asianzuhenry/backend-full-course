import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// CRUD OPERATIONS

// get all todos -> READ
router.get('/', (req, res) => {
    
    const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`);
    const todos = getTodos.all(req.userId);
    res.json(todos);

})

// add a todo -> CREATE
router.post('/', (req, res) => {
    const {task } = req.body
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    const result = insertTodo.run(req.userId, task)

    res.json({ id: result.lastInsertRowid, task, completed: 0})
})

// update a todo -> UPDATE
router.put('/:id', (req, res) => {
    const { completed } = req.body
    const { id } = req.params

    const updatedTodo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`)
    updatedTodo.run(completed, id)

    res.json({ message: "completed" })

})

// delete a todo -> DELETE
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, userId)
    res.send({ message: "todo deleted" })
})

export default router