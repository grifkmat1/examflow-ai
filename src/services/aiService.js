/**
 * src/services/aiService.js
 *
 * Central AI integration layer for ExamFlow.
 * All Claude API calls are routed through this module:
 *  - API key management in one place
 *  - Caching prevents redundant costly calls
 *  - Fallback logic ensures app keeps working if AI is unavailable
 *  - Streaming helpers for SSE support
 */

'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const NodeCache = require('node-cache');
const crypto    = require('crypto');
const logger    = require('../utils/logger');

// ── Singleton Anthropic client ─────────────────────────────────────────────

let _client = null;

function getClient() {
  if (!_client) {
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error('CLAUDE_API_KEY is not set. Add it to your .env file.');
    }
    _client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
  }
  return _client;
}

// ── Response cache ─────────────────────────────────────────────────────────

const CACHE_TTL = parseInt(process.env.AI_CACHE_TTL_SECONDS, 10) || 300;
const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: 60 });

function cacheKey(prompt) {
  return crypto.createHash('sha256').update(prompt).digest('hex');
}

// ── Shared model config ────────────────────────────────────────────────────

const MODEL      = process.env.CLAUDE_MODEL      || 'claude-sonnet-4-6';
const MAX_TOKENS = parseInt(process.env.CLAUDE_MAX_TOKENS, 10) || 4096;

// ── Internal: call Claude and return raw text ──────────────────────────────

async function callClaude(systemPrompt, userPrompt, opts = {}) {
  const combinedPrompt = systemPrompt + '---' + userPrompt;
  const key = cacheKey(combinedPrompt);

  if (!opts.skipCache) {
    const cached = cache.get(key);
    if (cached !== undefined) {
      logger.info('[AIService] Cache hit', { key: key.slice(0, 8) });
      return cached;
    }
  }

  logger.info('[AIService] Calling Claude', { model: MODEL });

  const message = await getClient().messages.create({
    model:      MODEL,
    max_tokens: MAX_TOKENS,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  });

  const text = message.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');

  cache.set(key, text);
  logger.info('[AIService] Response received', { inputTokens: message.usage?.input_tokens, outputTokens: message.usage?.output_tokens });
  return text;
}

// ── Internal: safely parse JSON from Claude response ──────────────────────

function parseJSON(text) {
  const cleaned = text
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim();
  return JSON.parse(cleaned);
}

// ═══════════════════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════════════════

const AIService = {

  // ── 1. Study Plan Generation ──────────────────────────────────────────────

  async generateStudyPlan({ exams, dailyHours = 6, weakSubjects = [], startDate }) {
    const systemPrompt = `You are an expert academic coach specialising in exam preparation strategy.
Produce a personalised day-by-day study plan in strict JSON. No prose, no markdown fences.
Schema: { planStart, planEnd, totalStudyHours, aiGenerated: true, courseAllocation: [{courseCode, courseTitle, difficulty, totalAllocatedHours, priorityRank, focusAreas, studyTips}], dailySessions: [{date, dayOfWeek, totalHours, sessions: [{courseCode, topic, durationMinutes, technique, notes}]}], generalAdvice, weeklyMilestones: [{week, goal}] }`;

    const userPrompt = `Exams: ${JSON.stringify(exams)}
Daily hours: ${dailyHours}
Start date: ${startDate || new Date().toISOString().split('T')[0]}
Weak subjects: ${weakSubjects.join(', ') || 'none'}`;

    try {
      const text = await callClaude(systemPrompt, userPrompt);
      const plan = parseJSON(text);
      plan.aiGenerated = true;
      return plan;
    } catch (err) {
      logger.error('[AIService] generateStudyPlan failed, using fallback', { err: err.message });
      return AIService._fallbackStudyPlan(exams, dailyHours, startDate);
    }
  },

  // ── 2. Risk and Optimisation Recommendations ──────────────────────────────

  async generateRecommendations({ exams, analyticsData }) {
    const systemPrompt = `You are a university academic advisor. Analyse the exam schedule and return recommendations in strict JSON. No prose, no markdown fences.
Schema: { aiGenerated: true, overallRiskLevel, riskFactors: [{factor, severity, detail}], scheduleOptimisations: [{priority, suggestion, impact}], wellbeingTips, studyStrategyByExam: [{courseCode, recommendedApproach, keyTopics, timeAllocationPercent}], summary }`;

    const userPrompt = `Exams: ${JSON.stringify(exams)}
Analytics: ${JSON.stringify(analyticsData)}`;

    try {
      const text = await callClaude(systemPrompt, userPrompt);
      const result = parseJSON(text);
      result.aiGenerated = true;
      return result;
    } catch (err) {
      logger.error('[AIService] generateRecommendations failed, using fallback', { err: err.message });
      return AIService._fallbackRecommendations(analyticsData);
    }
  },

  // ── 3. Natural Language to Structured Exam Data ───────────────────────────

  async parseNaturalLanguageExam(naturalLanguageInput) {
    const currentYear = new Date().getFullYear();
    const systemPrompt = `Convert free-text exam descriptions into structured JSON. No prose, no markdown fences.
Schema: { course_code, section, course_title, exam_type (FINAL|MIDTERM|QUIZ), start_time (ISO 8601), end_time (ISO 8601), building, room, semester, difficulty (1-5), confidence (0-1), notes }
Rules: FINAL=3h, MIDTERM=2h, QUIZ=1h if not stated. Year defaults to ${currentYear}.`;

    const userPrompt = `Parse: "${naturalLanguageInput}"`;

    try {
      const text = await callClaude(systemPrompt, userPrompt, { skipCache: true });
      const result = parseJSON(text);
      if (!['FINAL', 'MIDTERM', 'QUIZ'].includes(result.exam_type)) result.exam_type = 'FINAL';
      result.aiGenerated = true;
      return result;
    } catch (err) {
      logger.error('[AIService] parseNaturalLanguageExam failed', { err: err.message });
      throw new Error(`Could not parse exam description: ${err.message}`);
    }
  },

  // ── 4. Streaming Study Plan ────────────────────────────────────────────────

  async streamStudyPlan({ exams, dailyHours = 6, weakSubjects = [], startDate }, res) {
    const systemPrompt = 'You are an expert academic coach. Generate a detailed study plan using clear markdown formatting.';
    const userPrompt = `Create a comprehensive study plan for: ${JSON.stringify(exams)}
Daily hours: ${dailyHours}. Start: ${startDate || new Date().toISOString().split('T')[0]}. Weak: ${weakSubjects.join(', ') || 'none'}`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const stream = await getClient().messages.stream({
      model: MODEL, max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  },

  // ── Fallback helpers ───────────────────────────────────────────────────────

  _fallbackStudyPlan(exams, dailyHours, startDate) {
    if (!exams || !exams.length) return { message: 'No exams provided', sessions: [], aiGenerated: false };
    const sorted = [...exams].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    const totalWeight = sorted.reduce((s, e) => s + (e.difficulty || 3), 0);
    return {
      planStart: startDate || new Date().toISOString().split('T')[0],
      planEnd: sorted[sorted.length - 1]?.start_time?.split('T')[0],
      totalStudyHours: dailyHours * 14,
      aiGenerated: false, fallback: true,
      courseAllocation: sorted.map((exam, idx) => ({
        courseCode: exam.course_code, courseTitle: exam.course_title, difficulty: exam.difficulty || 3,
        totalAllocatedHours: parseFloat((((exam.difficulty || 3) / totalWeight) * dailyHours * 14).toFixed(1)),
        priorityRank: idx + 1, focusAreas: ['Core concepts'], studyTips: ['Use spaced repetition'],
      })),
      dailySessions: [],
      generalAdvice: ['AI service is unavailable. This is a simplified fallback plan.', 'Prioritise exams happening soonest.'],
    };
  },

  _fallbackRecommendations(analyticsData) {
    return {
      aiGenerated: false, fallback: true,
      overallRiskLevel: analyticsData?.stressScore?.level || 'MODERATE',
      riskFactors: (analyticsData?.recommendations || []).map(r => ({ factor: r.message, severity: r.priority, detail: 'Rule-based fallback.' })),
      scheduleOptimisations: [],
      wellbeingTips: ['Maintain a consistent sleep schedule.', 'Take short breaks every 45-60 minutes.'],
      studyStrategyByExam: [],
      summary: 'AI service is unavailable. These are rule-based recommendations only.',
    };
  },
};

module.exports = AIService;
