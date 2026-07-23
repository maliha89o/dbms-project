require('dotenv').config();
const util = require('util');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { Pool } = require('pg');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

// MySQL connection

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect(()=>{
  console.log('Connected to MySQL database');
});

const queryAsync = util.promisify(connection.query).bind(connection);

// PostgreSQL Connection

const pgPool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE,
  ssl: process.env.PG_SSL === 'false' ? false : { rejectUnauthorized: false },
});

pgPool.connect()
  .then((client) => {
    console.log('Connected to PostgreSQL database');
    client.release();
  })
  .catch((err) => {
    console.error('PostgreSQL connection error', err);
  });


app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

const toNull = (v) => (v === '' || v === undefined ? null : v);


// Mongodb connection

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri,
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

let complaintsCollection;
let usersCollection;

async function connectToMongoDB() {
  try {
    await client.connect();

    const db = client.db('project');
    complaintsCollection = db.collection('complaints');
    usersCollection = db.collection('users');

    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

// from mongodb
app.post('/complaints', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'subject and message are required' });
  }

  try {
    const result = await complaintsCollection.insertOne({ name, email, subject, message, createdAt: new Date() });
    res.status(201).json({ id: result.insertedId, name, email, subject, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.get('/complaints', async (req, res) => {
  try {
    const complaints = await complaintsCollection.find().toArray();
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.put('/complaints/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'subject and message are required' });
  }

  try {
    const result = await complaintsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, email, subject, message } },
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.delete('/complaints/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await complaintsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// from mongodb — upserted by the frontend on every successful Firebase sign-in
app.put('/users/sync', async (req, res) => {
  const { uid, name, email, imageUrl } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'uid is required' });
  }

  try {
    const result = await usersCollection.findOneAndUpdate(
      { uid },
      {
        $set: { uid, name: toNull(name), email: toNull(email), imageUrl: toNull(imageUrl), lastLoginAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, returnDocument: 'after' }
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await usersCollection.find().sort({ _id: -1 }).toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

// from mysql
app.post('/students', (req, res) => {
  const { name, email, age, mobile, work, add, decription } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  connection.query(
    'INSERT INTO students (name, email, age, mobile, work, `add`, decription) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, toNull(email), toNull(age), toNull(mobile), toNull(work), toNull(add), toNull(decription)],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, name, email, age, mobile, work, add, decription });
    }
  );
})

app.get('/students', (req, res) => {
  connection.query('SELECT * FROM students', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
})

app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, age, mobile, work, add, decription } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  connection.query(
    'UPDATE students SET name = ?, email = ?, age = ?, mobile = ?, work = ?, `add` = ?, decription = ? WHERE id = ?',
    [name, toNull(email), toNull(age), toNull(mobile), toNull(work), toNull(add), toNull(decription), id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json({ id: Number(id), name, email, age, mobile, work, add, decription });
    }
  );
})

app.delete('/students/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM students WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(204).end();
  });
})


// from postgresql
app.post('/courses', async (req, res) => {
  const { title, description, price, instructor } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  try {
    const result = await pgPool.query(
      'INSERT INTO courses (title, description, price, instructor) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, price, instructor]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.get('/courses', async (req, res) => {
  try {
    const result = await pgPool.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.put('/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price, instructor } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  try {
    const result = await pgPool.query(
      'UPDATE courses SET title = $1, description = $2, price = $3, instructor = $4 WHERE id = $5 RETURNING *',
      [title, description, price, instructor, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.delete('/courses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pgPool.query('DELETE FROM courses WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

// Aggregate read-only snapshot across all three databases, for the dashboard.
app.get('/stats', async (req, res) => {
  try {
    const [
      studentsCountRows,
      recentStudents,
      coursesCountResult,
      coursesPriceResult,
      recentCoursesResult,
      complaintsCount,
      recentComplaints,
    ] = await Promise.all([
      queryAsync('SELECT COUNT(*) AS count FROM students'),
      queryAsync('SELECT id, name, work FROM students ORDER BY id DESC LIMIT 5'),
      pgPool.query('SELECT COUNT(*) AS count FROM courses'),
      pgPool.query('SELECT AVG(price) AS avg, MIN(price) AS min, MAX(price) AS max FROM courses'),
      pgPool.query('SELECT id, title, price FROM courses ORDER BY id DESC LIMIT 5'),
      complaintsCollection.countDocuments(),
      complaintsCollection.find().sort({ _id: -1 }).limit(5).toArray(),
    ]);

    const priceRow = coursesPriceResult.rows[0];

    res.json({
      students: {
        count: studentsCountRows[0].count,
        recent: recentStudents,
      },
      courses: {
        count: Number(coursesCountResult.rows[0].count),
        avgPrice: priceRow.avg !== null ? Number(priceRow.avg) : null,
        minPrice: priceRow.min !== null ? Number(priceRow.min) : null,
        maxPrice: priceRow.max !== null ? Number(priceRow.max) : null,
        recent: recentCoursesResult.rows,
      },
      complaints: {
        count: complaintsCount,
        recent: recentComplaints,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})