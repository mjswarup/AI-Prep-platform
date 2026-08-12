import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'prep_platform';
const MONGODB_USERS_COLLECTION = process.env.MONGODB_USERS_COLLECTION || 'users';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

const PROCTORING_DATA_DIR = path.join(__dirname, 'proctoring_data');
const MOCK_PAPERS_DIR = path.join(__dirname, 'mock_papers');
const USERS_FILE = path.join(__dirname, 'users.json');
if (!fs.existsSync(PROCTORING_DATA_DIR)) {
    fs.mkdirSync(PROCTORING_DATA_DIR);
}
if (!fs.existsSync(MOCK_PAPERS_DIR)) {
    fs.mkdirSync(MOCK_PAPERS_DIR);
}

const upload = multer({ storage: multer.diskStorage({ destination: MOCK_PAPERS_DIR, filename: (req, file, cb) => cb(null, file.originalname) }) });

let mongoClient = null;
let usersCollection = null;
let useMongo = Boolean(MONGODB_URI);

const initMongo = async () => {
  if (!useMongo) {
    console.log('MongoDB is not configured. Using local JSON persistence.');
    return;
  }

  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db(MONGODB_DB_NAME);
    usersCollection = db.collection(MONGODB_USERS_COLLECTION);
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log(`Connected to MongoDB database '${MONGODB_DB_NAME}', collection '${MONGODB_USERS_COLLECTION}'.`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    useMongo = false;
  }
};

const readUsers = () => {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

const hashPassword = async (rawPassword) => {
  return await bcrypt.hash(rawPassword, 10);
};

const comparePassword = async (rawPassword, hashedPassword) => {
  if (!hashedPassword) {
    return false;
  }
  return await bcrypt.compare(rawPassword, hashedPassword);
};

const findUserByEmail = async (email) => {
  const normalized = email.trim().toLowerCase();
  if (useMongo && usersCollection) {
    return await usersCollection.findOne({ email: normalized });
  }

  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === normalized);
};

const updateLocalUserPassword = (email, hashedPassword) => {
  const users = readUsers();
  const normalized = email.trim().toLowerCase();
  const updated = users.map((user) => {
    if (user.email.toLowerCase() === normalized) {
      return { ...user, password: hashedPassword };
    }
    return user;
  });
  writeUsers(updated);
};

const insertUser = async (user) => {
  const normalized = {
    ...user,
    email: user.email.trim().toLowerCase(),
    password: await hashPassword(user.password),
  };

  if (useMongo && usersCollection) {
    const result = await usersCollection.insertOne(normalized);
    return { ...normalized, id: result.insertedId.toString() };
  }

  const users = readUsers();
  users.push(normalized);
  writeUsers(users);
  return normalized;
};

const getAllUsers = async () => {
  if (useMongo && usersCollection) {
    return await usersCollection.find({}, { projection: { password: 0 } }).toArray();
  }
  return readUsers().map(({ password, ...rest }) => rest);
};

const deleteNonAdminUsers = async () => {
  if (useMongo && usersCollection) {
    await usersCollection.deleteMany({ role: { $ne: 'admin' } });
    return;
  }
  const users = readUsers();
  const filtered = users.filter((u) => u.email.toLowerCase() === 'manukondajswaroop@gmail.com');
  writeUsers(filtered);
};

const normalizeLocalUser = async (user) => {
  const normalized = {
    ...user,
    email: user.email.trim().toLowerCase(),
    role: user.role || (user.isAdmin ? 'admin' : 'student'),
    dreamCompanies: user.dreamCompanies?.length ? user.dreamCompanies : ['Google', 'Amazon'],
    streak: typeof user.streak === 'number' ? user.streak : 0,
    xp: typeof user.xp === 'number' ? user.xp : 0,
    level: typeof user.level === 'number' ? user.level : 0,
    isAdmin: Boolean(user.isAdmin),
  };

  if (!/^(?:\$2[aby]\$|\$argon2)/.test(normalized.password || '')) {
    normalized.password = await hashPassword(normalized.password || '');
  }

  return normalized;
};

const migrateLocalUsersToMongo = async () => {
  if (!useMongo || !usersCollection) return;

  const localUsers = readUsers();
  for (const user of localUsers) {
    if (!user?.email) continue;
    const normalized = await normalizeLocalUser(user);
    const existing = await usersCollection.findOne({ email: normalized.email });
    if (!existing) {
      await usersCollection.insertOne(normalized);
      continue;
    }

    const updates = {};
    if (!existing.role && normalized.role) updates.role = normalized.role;
    if (!existing.isAdmin && normalized.isAdmin) updates.isAdmin = normalized.isAdmin;
    if (normalized.password && !/^(?:\$2[aby]\$|\$argon2)/.test(existing.password || '')) {
      updates.password = normalized.password;
    }
    if (Object.keys(updates).length) {
      await usersCollection.updateOne({ email: normalized.email }, { $set: updates });
    }
  }
};

const ensureAdminUser = async () => {
  if (!useMongo || !usersCollection) return;

  const adminEmail = (process.env.ADMIN_EMAIL || 'manukondajswaroop@gmail.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'swarup@22';
  const adminName = process.env.ADMIN_NAME || 'Admin';
  const adminCollege = process.env.ADMIN_COLLEGE || 'Admin Institute';

  const existingAdmin = await usersCollection.findOne({ email: adminEmail });
  const hashedPassword = await hashPassword(adminPassword);
  const adminUser = {
    id: `admin_${Date.now()}`,
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    college: adminCollege,
    branch: 'Administration',
    gradYear: process.env.ADMIN_GRAD_YEAR || '2026',
    dreamCompanies: ['Admin'],
    streak: 0,
    xp: 0,
    level: 0,
    isAdmin: true,
  };

  if (!existingAdmin) {
    await usersCollection.insertOne(adminUser);
    console.log(`MongoDB admin user created for ${adminEmail}`);
    return;
  }

  const updates = {};
  if (existingAdmin.role !== 'admin') updates.role = 'admin';
  if (!existingAdmin.isAdmin) updates.isAdmin = true;
  if (!/^(?:\$2[aby]\$|\$argon2)/.test(existingAdmin.password || '')) updates.password = hashedPassword;

  if (Object.keys(updates).length) {
    await usersCollection.updateOne({ email: adminEmail }, { $set: updates });
    console.log(`MongoDB admin user updated for ${adminEmail}`);
  }
};

const extractTextFromFile = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  if (filePath.endsWith('.pdf')) {
    const data = await pdfParse(buffer);
    return data.text || '';
  }
  if (filePath.endsWith('.docx') || filePath.endsWith('.doc')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }
  return buffer.toString('utf-8');
};

const createQuestionsFromText = (text, count) => {
  const cleaned = text
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const lines = cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 30);

  const questionSentences = lines.flatMap((line) =>
    line
      .split(/(?<=[?.!])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.endsWith('?') && sentence.length > 40 && sentence.length < 220)
  );

  const numberedLines = lines.filter((line) => /^(?:Q\d+\s*[\).:-]?|\d+\s*[\).:-]?)/i.test(line) && line.length > 40);

  const questionLikeLines = lines.filter((line) =>
    !line.endsWith('?') && /\b(list|explain|describe|compare|contrast|name|why|how|what|which|define|mention)\b/i.test(line) && line.length > 40
  );

  const source =
    questionSentences.length >= count ? questionSentences
      : numberedLines.length >= count ? numberedLines
      : [...questionSentences, ...numberedLines, ...questionLikeLines, ...lines];

  const candidates = Array.from(new Set(source)).slice(0, Math.max(source.length, count * 3));

  const transformStatementToQuestion = (snippet) => {
    const trimmed = snippet.replace(/^[\s\-]*?(?:Q\d+\s*[\).:-]?|\d+\s*[\).:-]?)/i, '').trim();
    if (!trimmed) return null;
    const normalized = trimmed.replace(/\s+/g, ' ').replace(/\.$/, '').trim();
    const lower = normalized.toLowerCase();

    if (normalized.endsWith('?')) return normalized;
    if (/\b(define|what is|name|list|explain|describe|compare|contrast|how|why|which|when|where)\b/i.test(normalized)) {
      return `${normalized}?`;
    }
    if (/\b(is|are|was|were|can|could|should|must|will|do|does|did|has|have|had)\b/i.test(lower)) {
      return `Based on the passage, answer: ${normalized}`;
    }
    if (/\b(defines?|means?)\b/i.test(lower)) {
      return `What does the following statement describe? ${normalized}`;
    }
    return `Create a practice question based on this statement: ${normalized}`;
  };

  const questions = [];
  for (let i = 0; i < count && i < candidates.length; i += 1) {
    const candidate = candidates[i];
    const question = transformStatementToQuestion(candidate);
    if (question) {
      questions.push(question);
    }
  }

  while (questions.length < count) {
    questions.push('Create a practice question based on the uploaded mock paper content.');
  }

  return questions;
};

app.get('/api/mock-papers', (req, res) => {
  try {
    const files = fs.readdirSync(MOCK_PAPERS_DIR).filter((name) => /\.(pdf|docx|doc)$/i.test(name));
    return res.json(files);
  } catch (error) {
    console.error('Error reading mock paper folder:', error);
    return res.status(500).json({ error: { message: 'Unable to read mock paper folder.' } });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: { message: 'Email and password are required.' } });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid email or password.' } });
    }

    const isMatched = await comparePassword(password, user.password);
    if (!isMatched) {
      if (user.password === password) {
        const hashed = await hashPassword(password);
        if (useMongo && usersCollection) {
          await usersCollection.updateOne({ email: user.email }, { $set: { password: hashed } });
        } else {
          updateLocalUserPassword(email, hashed);
        }
      } else {
        return res.status(401).json({ error: { message: 'Invalid email or password.' } });
      }
    }

    const { password: _pwd, ...userSafe } = user;
    return res.json({ user: userSafe });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: { message: 'Unable to authenticate user.' } });
  }
});

app.post('/api/users/register', async (req, res) => {
  const { name, email, password, college, branch, gradYear, dreamCompanies } = req.body || {};
  if (!name || !email || !password || !college) {
    return res.status(400).json({ error: { message: 'Name, email, password, and college are required.' } });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: { message: 'User already exists.' } });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      password,
      role: 'student',
      college,
      branch: branch || 'Computer Science & Engineering',
      gradYear: gradYear || '2027',
      dreamCompanies: dreamCompanies?.length ? dreamCompanies : ['Google', 'Amazon'],
      streak: 0,
      xp: 0,
      level: 0,
      isAdmin: false,
    };

    const inserted = await insertUser(newUser);
    const { password: _pwd, ...userSafe } = inserted;
    return res.status(201).json({ user: userSafe });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: { message: 'Unable to register user.' } });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: { message: 'Unable to fetch users.' } });
  }
});

app.delete('/api/users', async (req, res) => {
  try {
    await deleteNonAdminUsers();
    return res.json({ message: 'Removed non-admin users; admin user preserved.' });
  } catch (error) {
    console.error('Error deleting users:', error);
    return res.status(500).json({ error: { message: 'Unable to remove users.' } });
  }
});

app.post('/api/mock-papers/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: 'No file uploaded.' } });
  }

  return res.status(201).json({ originalname: req.file.originalname, filename: req.file.filename });
});

app.post('/api/mock-papers/open', (req, res) => {
  try {
    const folderPath = MOCK_PAPERS_DIR;
    if (process.platform === 'win32') {
      exec(`start "" "${folderPath}"`);
    } else if (process.platform === 'darwin') {
      exec(`open "${folderPath}"`);
    } else {
      exec(`xdg-open "${folderPath}"`);
    }
    return res.json({ message: 'Opened mock_papers folder on the server machine.' });
  } catch (error) {
    console.error('Unable to open mock_papers folder:', error);
    return res.status(500).json({ error: { message: 'Unable to open mock_papers folder.' } });
  }
});

app.post('/api/mock-papers/generate', async (req, res) => {
  const { filename, count = 5 } = req.body || {};
  if (!filename) {
    return res.status(400).json({ error: { message: 'Filename is required.' } });
  }

  const filePath = path.join(MOCK_PAPERS_DIR, path.basename(filename));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: { message: 'Selected file does not exist.' } });
  }

  try {
    const text = await extractTextFromFile(filePath);
    const questions = createQuestionsFromText(text, Number(count));
    return res.json({ questions, message: `Generated ${questions.length} questions from ${filename}.` });
  } catch (error) {
    console.error('Unable to generate questions:', error);
    return res.status(500).json({ error: { message: 'Failed to generate questions from the uploaded paper.' } });
  }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Prep platform API is running' });
});

app.post('/api/coach/chat/completions', async (req, res) => {
    const { messages, model = 'gpt-3.5-turbo', max_tokens = 500, temperature = 0.7 } = req.body || {};

    if (!OPENAI_API_KEY) {
        return res.status(500).json({
            error: {
                message: 'OPENAI_API_KEY is not configured on the server. Set it in the backend environment before enabling live AI responses.',
            },
        });
    }

    try {
        const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens,
                temperature,
            }),
        });

        const responseData = await openAiResponse.json();

        if (!openAiResponse.ok) {
            return res.status(openAiResponse.status).json(responseData);
        }

        return res.json(responseData);
    } catch (error) {
        console.error('OpenAI proxy error:', error);
        return res.status(500).json({
            error: {
                message: 'Failed to reach the OpenAI API from the server.',
            },
        });
    }
});

app.post('/proctoring/data', (req, res) => {
    const { webcamImage, screenImage } = req.body;
    const timestamp = Date.now();
    const studentId = 'student_123';
    const assessmentId = 'assessment_abc';

    const incident = {
        studentId,
        assessmentId,
        timestamp,
        anomalies: [],
    };

    if (webcamImage) {
        const webcamFileName = `${studentId}-${assessmentId}-webcam-${timestamp}.jpeg`;
        const webcamFilePath = path.join(PROCTORING_DATA_DIR, webcamFileName);
        const base64Data = webcamImage.replace(/^data:image\/jpeg;base64,/, '');
        fs.writeFile(webcamFilePath, base64Data, 'base64', (err) => {
            if (err) {
                console.error(`Error saving webcam image: ${err}`);
            } else {
                console.log(`Webcam image saved: ${webcamFileName}`);
                incident.webcamImagePath = webcamFileName;
            }
        });
    }

    if (screenImage) {
        const screenFileName = `${studentId}-${assessmentId}-screen-${timestamp}.jpeg`;
        const screenFilePath = path.join(PROCTORING_DATA_DIR, screenFileName);
        const base64Data = screenImage.replace(/^data:image\/jpeg;base64,/, '');
        fs.writeFile(screenFilePath, base64Data, 'base64', (err) => {
            if (err) {
                console.error(`Error saving screen image: ${err}`);
            } else {
                console.log(`Screen image saved: ${screenFileName}`);
                incident.screenImagePath = screenFileName;
            }
        });
    }

    console.log('Received proctoring data. Incident:', incident);
    res.status(200).send('Data received');
});

const startServer = async () => {
    await initMongo();

    if (useMongo && usersCollection) {
        await migrateLocalUsersToMongo();
        await ensureAdminUser();
    }

    app.listen(PORT, () => {
        console.log(`Prep platform server running on http://localhost:${PORT}`);
        if (!OPENAI_API_KEY) {
            console.log('AI coaching is running in mock mode until OPENAI_API_KEY is set on the server.');
        }
        if (!useMongo) {
            console.log('User storage is using local JSON fallback. Set MONGODB_URI to enable MongoDB persistence.');
        }
    });
};

startServer();