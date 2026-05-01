// ─── Exam Types ─────────────────────────────────────────────────────────────

export type ExamType = 'FINAL' | 'MIDTERM' | 'QUIZ' | 'ASSIGNMENT'

export interface Exam {
  id: string
  course_code: string
  course_title: string
  exam_type: ExamType
  start_time: string
  end_time: string
  semester: string
  location?: string
  credit_hours?: number
  notes?: string
  created_at?: string
}

export interface CreateExamInput {
  course_code: string
  course_title: string
  exam_type: ExamType
  start_time: string
  end_time: string
  semester: string
  location?: string
  credit_hours?: number
  notes?: string
}

export interface Conflict {
  type: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  message: string
  exams: Exam[]
}

// ─── Study Plan Types ─────────────────────────────────────────────────────────

export interface StudyPlanRequest {
  codes: string[]
  semester: string
  dailyHours?: number
  weakSubjects?: string[]
  stream?: boolean
}

export interface StudyPlanResponse {
  study_plan?: string
  plan?: string
  generated_at?: string
  exams?: Exam[]
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface WorkloadData {
  totalExams: number
  totalCreditHours: number
  examsByType: Record<string, number>
  weeklyDistribution: WeekData[]
  conflictsCount: number
  highRiskExams: number
}

export interface WeekData {
  week: string
  exams: number
  creditHours: number
}

export interface ScheduleAnalytics {
  busiest_day?: string
  average_gap_days?: number
  back_to_back_count?: number
  risk_score?: number
}

// ─── AI Types ────────────────────────────────────────────────────────────────

export interface ParsedExam {
  course_code?: string
  course_title?: string
  exam_type?: ExamType
  start_time?: string
  end_time?: string
  location?: string
  semester?: string
  confidence?: number
}

export interface ParseResponse {
  parsed?: ParsedExam
  exam?: Exam
  raw?: string
}

export interface RecommendationResponse {
  recommendations: string[]
  risk_assessment?: string
  priority_subjects?: string[]
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface ExamsListResponse {
  exams: Exam[]
  count: number
}

export interface ConflictsResponse {
  conflicts: Conflict[]
  count: number
}

// ─── UI Types ────────────────────────────────────────────────────────────────

export interface NavItem {
  href: string
  label: string
  icon: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
