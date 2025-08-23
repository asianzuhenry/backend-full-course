import express from 'express';
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5003

// get the file pathe from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// get dir name
const __dirname = dirname(__filename)

// middleware
app.use(express.json())

// gets static files and html file
app.use(express.static(path.join(__dirname, '../public')))

// serving the html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ROUTES
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log('Server is running');
    
})
