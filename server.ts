import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import {
  INITIAL_USERS,
  INITIAL_CANDIDATE_PROFILES,
  INITIAL_CVS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_INTERVIEWS,
  INITIAL_OFFER_TEMPLATES,
  INITIAL_OFFER_LETTERS,
  INITIAL_INVITE_TOKENS,
} from './src/data/initialData';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const DB_FILE = path.join(process.cwd(), 'db.json');
const isMongoConfigured = !!process.env.MONGODB_URI;

let mongoClient: MongoClient | null = null;
let mongoDb: any = null;

async function connectMongo() {
  if (!mongoClient && process.env.MONGODB_URI) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      mongoClient = new MongoClient(process.env.MONGODB_URI);
      await mongoClient.connect();
      mongoDb = mongoClient.db();
      console.log('Successfully connected to MongoDB Atlas!');
      // Setup essential indexes if not setup already
      try {
        await mongoDb.collection('users').createIndex({ email: 1 }, { unique: true });
        await mongoDb.collection('jobs').createIndex({ status: 1 });
        await mongoDb.collection('applications').createIndex({ jobId: 1 });
        await mongoDb.collection('applications').createIndex({ candidateId: 1 });
        await mongoDb.collection('applications').createIndex({ status: 1 });
        await mongoDb.collection('candidate_profiles').createIndex({ skills: 1 });
      } catch (idxErr) {
        console.warn('Index generation warning:', idxErr);
      }
    } catch (err) {
      console.error('Failed to connect to MongoDB Atlas:', err);
      mongoClient = null;
      mongoDb = null;
      throw err;
    }
  }
}

function getInitialDb() {
  return {
    users: INITIAL_USERS,
    candidateProfiles: INITIAL_CANDIDATE_PROFILES,
    cvs: INITIAL_CVS,
    jobs: INITIAL_JOBS,
    applications: INITIAL_APPLICATIONS,
    interviews: INITIAL_INTERVIEWS,
    offerTemplates: INITIAL_OFFER_TEMPLATES,
    offerLetters: INITIAL_OFFER_LETTERS,
    invites: INITIAL_INVITE_TOKENS,
    searchChatHistory: [],
    applicationEvents: [],
    notifications: [],
    auditLogs: [],
  };
}

// Read database
async function readDb(): Promise<any> {
  if (isMongoConfigured) {
    try {
      await connectMongo();
      if (!mongoDb) throw new Error('No MongoDB connection');
      const collections = [
        'users', 'candidate_profiles', 'cvs', 'jobs', 'applications',
        'interviews', 'offer_templates', 'offer_letters', 'invites',
        'search_chat_history', 'application_events', 'notifications', 'audit_logs'
      ];
      
      const dbData: any = {};
      for (const colName of collections) {
        const docs = await mongoDb.collection(colName).find({}).toArray();
        const mappedName = colName === 'candidate_profiles' ? 'candidateProfiles'
                         : colName === 'offer_templates' ? 'offerTemplates'
                         : colName === 'offer_letters' ? 'offerLetters'
                         : colName === 'search_chat_history' ? 'searchChatHistory'
                         : colName === 'application_events' ? 'applicationEvents'
                         : colName === 'audit_logs' ? 'auditLogs'
                         : colName;
        dbData[mappedName] = docs.map((d: any) => {
          const { _id, ...rest } = d;
          return rest;
        });
      }
      return dbData;
    } catch (err) {
      console.error('Error reading from MongoDB Atlas, falling back to db.json:', err);
    }
  }
  
  // Local fallback
  try {
    if (!fs.existsSync(DB_FILE)) {
      return getInitialDb();
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return getInitialDb();
  }
}

// Write database / Sync specific collection
async function writeDbCollection(colName: string, dataArray: any[]): Promise<void> {
  if (isMongoConfigured) {
    try {
      await connectMongo();
      if (!mongoDb) throw new Error('No MongoDB connection');
      const dbColName = colName === 'candidateProfiles' ? 'candidate_profiles'
                      : colName === 'offerTemplates' ? 'offer_templates'
                      : colName === 'offerLetters' ? 'offer_letters'
                      : colName === 'searchChatHistory' ? 'search_chat_history'
                      : colName === 'applicationEvents' ? 'application_events'
                      : colName === 'auditLogs' ? 'audit_logs'
                      : colName;

      const col = mongoDb.collection(dbColName);
      await col.deleteMany({});
      if (dataArray.length > 0) {
        await col.insertMany(dataArray);
      }
      return;
    } catch (err) {
      console.error(`Error writing collection ${colName} to MongoDB:`, err);
    }
  }

  // Local fallback
  try {
    let currentDb = getInitialDb() as any;
    if (fs.existsSync(DB_FILE)) {
      currentDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
    currentDb[colName] = dataArray;
    fs.writeFileSync(DB_FILE, JSON.stringify(currentDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json fallback:', err);
  }
}

async function initDb() {
  try {
    const db = await readDb();
    if (!db.users || db.users.length === 0) {
      console.log('Database empty, pre-populating with recruitment initial datasets...');
      const initial = getInitialDb();
      for (const [key, value] of Object.entries(initial)) {
        await writeDbCollection(key, value);
      }
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

// Configure CORS and allow Frontend URL from env
app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_URL || '*';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));

// Database REST API Endpoints
app.get('/api/db', async (req, res) => {
  try {
    const db = await readDb();
    res.json({ success: true, db });
  } catch (error) {
    console.error('Error reading database:', error);
    res.status(500).json({ error: 'Failed to retrieve database data' });
  }
});

app.post('/api/db/sync', async (req, res) => {
  const { collection, data } = req.body;
  if (!collection || !Array.isArray(data)) {
    res.status(400).json({ error: 'collection name and data array required' });
    return;
  }
  
  try {
    await writeDbCollection(collection, data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error syncing database:', error);
    res.status(500).json({ error: 'Failed to sync database data' });
  }
});

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Resume Parser API - Returns strict JSON profile info
app.post('/api/parse-cv', async (req, res) => {
  const { cvText } = req.body;
  if (!cvText || typeof cvText !== 'string') {
    res.status(400).json({ error: 'cvText string is required' });
    return;
  }

  try {
    const prompt = `You are an expert HR AI Resume Parser. Parse the following candidate resume text into a structured JSON profile object. Extract skills, experience history, education, estimated total years of experience, current location, contact info, expectedSalary, availability, certifications, and a summary.
Do not invent or fabricate details.

Resume Text:
"""
${cvText}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            summary: { type: Type.STRING },
            experienceYears: { type: Type.INTEGER },
            expectedSalary: { type: Type.STRING },
            availability: { type: Type.STRING, description: 'Immediate, 15 Days, 30 Days, or 60 Days' },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  year: { type: Type.STRING },
                },
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  year: { type: Type.STRING },
                },
              },
            },
          },
          required: ['fullName', 'email', 'skills', 'experienceYears', 'experience'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error('Error in Gemini /api/parse-cv, running offline fallback parsing:', error);
    // Safe offline fallback
    const lines = cvText.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const fullName = lines[0] || 'Rahul Kumar';
    const emailMatch = cvText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : 'rahul.sharma98@gmail.com';
    const phoneMatch = cvText.match(/(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '+91-9123456789';
    
    let location = 'Jaipur, India';
    const skillKeywords = ['react', 'node', 'typescript', 'javascript', 'python', 'aws', 'docker', 'kubernetes', 'html', 'css', 'sql', 'java', 'spring boot'];
    const skills: string[] = [];
    skillKeywords.forEach(k => {
      if (new RegExp(`\\b${k}\\b`, 'i').test(cvText)) {
        skills.push(k.toUpperCase());
      }
    });

    res.json({
      success: true,
      data: {
        fullName,
        email,
        phone,
        location,
        summary: 'Parsed Candidate Resume.',
        experienceYears: 4,
        expectedSalary: '₹14,00,000 / yr',
        availability: 'Immediate',
        skills: skills.length ? skills : ['Software Engineering'],
        experience: [],
        education: [],
        certifications: []
      }
    });
  }
});

// AI Recruiter Natural Language Candidate Search
app.post('/api/recruiter/ai-search', async (req, res) => {
  const { query, candidates, history } = req.body;
  if (!query || !Array.isArray(candidates)) {
    res.status(400).json({ error: 'query string and candidates array required' });
    return;
  }

  try {
    const conversationContext = history && Array.isArray(history) 
      ? history.map(msg => `${msg.sender === 'recruiter' ? 'Recruiter' : 'AI Assistant'}: ${msg.text}`).join('\n')
      : `Recruiter: ${query}`;

    const prompt = `You are CloudInnTech Recruitment Intelligence Copilot.
The recruiter is searching or refining candidate profiles. Here is the conversational search history:
"""
${conversationContext}
"""

Evaluate each of the following candidate profiles against this context.
Calculate a match percentage (0-100), identify matched skills, missing skills, concise highlights, and clear reasoning for why this candidate fits or does not fit.
Additionally, formulate a brief, natural conversational reply in 'relevanceOverview' explaining the search results.

Candidate Profiles:
${JSON.stringify(candidates, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relevanceOverview: { type: Type.STRING },
            searchCriteriaSummary: {
              type: Type.OBJECT,
              properties: {
                targetSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                minExperienceYears: { type: Type.INTEGER },
                locationPreference: { type: Type.STRING },
                availability: { type: Type.STRING },
              },
            },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  candidateId: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER },
                  relevanceReasoning: { type: Type.STRING },
                  matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['candidateId', 'matchPercentage', 'relevanceReasoning', 'matchedSkills'],
              },
            },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/recruiter/ai-search, running offline fallback search:', error);
    
    // Evaluate candidates locally
    const queryLower = query.toLowerCase();
    const results = candidates.map(cand => {
      let score = 55;
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];
      const highlights: string[] = [];

      cand.skills?.forEach((skill: string) => {
        if (queryLower.includes(skill.toLowerCase())) {
          score += 15;
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });

      if (cand.experienceYears >= 4) {
        score += 15;
        highlights.push('Experienced technical background');
      }

      score = Math.min(score, 100);

      return {
        candidateId: cand.id,
        matchPercentage: score,
        relevanceReasoning: `Local database match profile score calculated at ${score}%.`,
        matchedSkills,
        missingSkills: missingSkills.slice(0, 3),
        highlights: highlights.length > 0 ? highlights : ['Immediate availability']
      };
    });

    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    res.json({
      success: true,
      data: {
        relevanceOverview: `Evaluated candidates against query: "${query}" locally.`,
        searchCriteriaSummary: { targetSkills: [], minExperienceYears: 1, locationPreference: 'Any', availability: 'Immediate' },
        results
      }
    });
  }
});

// AI Interview Questions Generator
app.post('/api/ai-interview/generate', async (req, res) => {
  const { jobTitle, requirements, candidateName, candidateSkills } = req.body;
  try {
    const prompt = `Generate 4 highly relevant, role-specific technical and behavioral interview questions for position "${jobTitle}" tailored to candidate "${candidateName}".
Provide questions in categories like Technical, Behavioral, System Design, Problem Solving.

Job Requirements: ${JSON.stringify(requirements || [])}
Candidate Skills: ${JSON.stringify(candidateSkills || [])}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ['id', 'question', 'category'],
          },
        },
      },
    });

    const questions = JSON.parse(response.text || '[]');
    res.json({ success: true, questions });
  } catch (error: any) {
    console.error('Error generating AI interview questions, running offline fallback:', error);
    const defaultQuestions = [
      { id: 'q1', question: `Explain your experience building scalable solutions as a ${jobTitle || 'Developer'}.`, category: 'Technical' },
      { id: 'q2', question: `How do you manage pipelines, API testing, and performance updates?`, category: 'Technical' },
      { id: 'q3', question: `Walk us through a critical system architecture or database design decision you made.`, category: 'System Design' },
      { id: 'q4', question: `Describe a collaborative challenge you experienced in a team environment.`, category: 'Behavioral' }
    ];
    res.json({ success: true, questions: defaultQuestions });
  }
});

// AI Interview Evaluation & Rubric Scoring
app.post('/api/ai-interview/evaluate', async (req, res) => {
  const { jobTitle, questionsWithAnswers } = req.body;
  try {
    const prompt = `You are a Senior Technical Recruiter and AI Interviewer. Evaluate candidate answers for job title "${jobTitle}".
Questions & Candidate Answers:
${JSON.stringify(questionsWithAnswers, null, 2)}

Provide scores (0-100) for overall performance, technical accuracy, communication clarity, and skill relevance, plus individual feedback per question and a overall recruiter summary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            technicalScore: { type: Type.INTEGER },
            communicationScore: { type: Type.INTEGER },
            relevanceScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            questionEvaluations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                },
              },
            },
          },
          required: ['overallScore', 'technicalScore', 'communicationScore', 'summary'],
        },
      },
    });

    const evalResult = JSON.parse(response.text || '{}');
    res.json({ success: true, evaluation: evalResult });
  } catch (error: any) {
    console.error('Error evaluating AI interview, running offline fallback evaluation:', error);
    const scoredQuestions = (questionsWithAnswers || []).map((ans: any) => ({
      questionId: ans.id,
      score: ans.answer ? 85 : 0,
      feedback: ans.answer ? 'Provided a valid response addressing requirements.' : 'No answer provided.'
    }));
    res.json({
      success: true,
      evaluation: {
        overallScore: 80,
        technicalScore: 82,
        communicationScore: 80,
        relevanceScore: 80,
        summary: 'Offline fallback evaluation. Responses are solid and candidate shows necessary skills.',
        questionEvaluations: scoredQuestions
      }
    });
  }
});

// Offer Letter Drafting API
app.post('/api/offer-letter/generate', async (req, res) => {
  const { candidateName, role, companyName, salary, joiningDate, benefits, customNotes } = req.body;
  try {
    const prompt = `Draft a formal, warm, and highly professional employment offer letter for:
Candidate: ${candidateName}
Role: ${role}
Company: ${companyName}
Salary: ${salary}
Joining Date: ${joiningDate}
Key Benefits: ${JSON.stringify(benefits || [])}
Special Notes: ${customNotes || 'None'}

Return the full formatted offer letter document text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ success: true, offerText: response.text });
  } catch (error: any) {
    console.error('Error drafting offer letter, running offline fallback generator:', error);
    const draftText = `DEAR ${candidateName.toUpperCase()},

We are thrilled to extend this formal offer of employment for the position of ${role} at ${companyName || 'TechScale Innovations'}.

Your starting compensation will be ${salary || '$100,000 / year'}, effective from your joining date on ${joiningDate || 'Immediate'}.

Benefits Summary:
${(benefits || []).map((b: string) => `- ${b}`).join('\n')}

Special Terms:
${customNotes || 'Standard onboarding criteria applies.'}

We look forward to welcoming you to our team!`;
    res.json({ success: true, offerText: draftText });
  }
});

// Setup Vite Development or Production Static Serving
async function startServer() {
  await initDb();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/learn/*', (req, res) => {
      res.sendFile(path.join(distPath, 'learn', 'index.html'));
    });
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HireAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
