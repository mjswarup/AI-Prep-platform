import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

const PROCTORING_DATA_DIR = path.join(__dirname, 'proctoring_data');
const MOCK_PAPERS_DIR = path.join(__dirname, 'mock_papers');
if (!fs.existsSync(PROCTORING_DATA_DIR)) {
    fs.mkdirSync(PROCTORING_DATA_DIR);
}
if (!fs.existsSync(MOCK_PAPERS_DIR)) {
    fs.mkdirSync(MOCK_PAPERS_DIR);
}

const upload = multer({ storage: multer.diskStorage({ destination: MOCK_PAPERS_DIR, filename: (req, file, cb) => cb(null, file.originalname) }) });

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

app.listen(PORT, () => {
    console.log(`Prep platform server running on http://localhost:${PORT}`);
    if (!OPENAI_API_KEY) {
        console.log('AI coaching is running in mock mode until OPENAI_API_KEY is set on the server.');
    }
});