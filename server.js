import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

const PROCTORING_DATA_DIR = path.join(__dirname, 'proctoring_data');
if (!fs.existsSync(PROCTORING_DATA_DIR)) {
    fs.mkdirSync(PROCTORING_DATA_DIR);
}

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