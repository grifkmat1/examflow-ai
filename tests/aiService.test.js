'use strict';
const mockCreate = jest.fn();
jest.mock('@anthropic-ai/sdk', () => jest.fn().mockImplementation(() => ({ messages: { create: mockCreate, stream: jest.fn() } })));
jest.mock('node-cache', () => jest.fn().mockImplementation(() => ({ get: jest.fn().mockReturnValue(undefined), set: jest.fn() })));

process.env.CLAUDE_API_KEY = 'test-key';
process.env.NODE_ENV = 'test';

const AIService = require('../src/services/aiService');

const SAMPLE_EXAMS = [
  { id: '1', course_code: 'CS301', course_title: 'Data Structures', exam_type: 'FINAL', start_time: '2025-05-12T09:00:00Z', end_time: '2025-05-12T12:00:00Z', difficulty: 4, semester: 'SPRING2025' },
  { id: '2', course_code: 'MATH201', course_title: 'Calculus II', exam_type: 'FINAL', start_time: '2025-05-14T13:00:00Z', end_time: '2025-05-14T15:00:00Z', difficulty: 3, semester: 'SPRING2025' },
];

function mockClaudeResponse(json) {
  mockCreate.mockResolvedValueOnce({ content: [{ type: 'text', text: JSON.stringify(json) }], usage: { input_tokens: 100, output_tokens: 200 } });
}

describe('AIService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('generateStudyPlan', () => {
    it('returns an AI-generated plan', async () => {
      mockClaudeResponse({ planStart: '2025-05-01', planEnd: '2025-05-14', totalStudyHours: 84, aiGenerated: true, courseAllocation: [], dailySessions: [], generalAdvice: [], weeklyMilestones: [] });
      const result = await AIService.generateStudyPlan({ exams: SAMPLE_EXAMS, dailyHours: 6 });
      expect(result.aiGenerated).toBe(true);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('returns fallback plan if Claude throws', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API timeout'));
      const result = await AIService.generateStudyPlan({ exams: SAMPLE_EXAMS, dailyHours: 6 });
      expect(result.fallback).toBe(true);
      expect(result.aiGenerated).toBe(false);
    });
  });

  describe('generateRecommendations', () => {
    it('returns AI recommendations', async () => {
      mockClaudeResponse({ aiGenerated: true, overallRiskLevel: 'MODERATE', riskFactors: [], scheduleOptimisations: [], wellbeingTips: [], studyStrategyByExam: [], summary: 'OK' });
      const result = await AIService.generateRecommendations({ exams: SAMPLE_EXAMS, analyticsData: { stressScore: { level: 'MODERATE' } } });
      expect(result.aiGenerated).toBe(true);
      expect(result.overallRiskLevel).toBeDefined();
    });

    it('returns fallback if Claude throws', async () => {
      mockCreate.mockRejectedValueOnce(new Error('Rate limit'));
      const result = await AIService.generateRecommendations({ exams: SAMPLE_EXAMS, analyticsData: {} });
      expect(result.fallback).toBe(true);
    });
  });

  describe('parseNaturalLanguageExam', () => {
    it('parses a natural language description', async () => {
      mockClaudeResponse({ course_code: 'CS301', course_title: 'Data Structures', exam_type: 'FINAL', start_time: '2025-12-15T09:00:00-05:00', end_time: '2025-12-15T12:00:00-05:00', semester: 'FALL2025', difficulty: 3, confidence: 0.88, notes: 'Inferred.' });
      const result = await AIService.parseNaturalLanguageExam('CS301 final on December 15 at 9am in Room 204');
      expect(result.course_code).toBe('CS301');
      expect(result.aiGenerated).toBe(true);
    });

    it('defaults exam_type to FINAL for unrecognised types', async () => {
      mockClaudeResponse({ course_code: 'ENG102', course_title: 'Writing', exam_type: 'UNKNOWN', start_time: '2025-12-10T10:00:00Z', end_time: '2025-12-10T11:00:00Z', semester: 'FALL2025', difficulty: 2, confidence: 0.5, notes: '' });
      const result = await AIService.parseNaturalLanguageExam('ENG102 test on Dec 10');
      expect(result.exam_type).toBe('FINAL');
    });

    it('throws if Claude fails', async () => {
      mockCreate.mockRejectedValueOnce(new Error('Auth error'));
      await expect(AIService.parseNaturalLanguageExam('CS301 final tomorrow')).rejects.toThrow('Could not parse exam description');
    });
  });
});
