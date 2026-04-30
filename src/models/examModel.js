'use strict';
const db = require('../config/database');

const ExamModel = {
  async findAll(filters = {}) {
    const conditions = [], values = [];
    if (filters.semester) { conditions.push('semester = $' + (values.length+1)); values.push(filters.semester); }
    if (filters.course_code) { conditions.push('LOWER(course_code) = LOWER($' + (values.length+1) + ')'); values.push(filters.course_code); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const result = await db.query('SELECT * FROM exams ' + where + ' ORDER BY start_time ASC', values);
    return result.rows;
  },
  async findById(id) {
    const result = await db.query('SELECT * FROM exams WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
  async findByCourseCodes(codes, semester) {
    const conditions = [], values = [];
    if (codes && codes.length) { conditions.push('LOWER(course_code) = ANY($' + (values.length+1) + ')'); values.push(codes.map(c=>c.toLowerCase())); }
    if (semester) { conditions.push('semester = $' + (values.length+1)); values.push(semester); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const result = await db.query('SELECT * FROM exams ' + where + ' ORDER BY start_time ASC', values);
    return result.rows;
  },
  async create(d) {
    const result = await db.query(
      'INSERT INTO exams (course_code,section,course_title,exam_type,start_time,end_time,building,room,semester,difficulty) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [d.course_code, d.section||null, d.course_title, d.exam_type, d.start_time, d.end_time, d.building||null, d.room||null, d.semester, d.difficulty||3]
    );
    return result.rows[0];
  },
  async delete(id) {
    const result = await db.query('DELETE FROM exams WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  },
  async findConflicting(startTime, endTime, excludeId = null) {
    const conditions = ['start_time < $2', 'end_time > $1'];
    const values = [startTime, endTime];
    if (excludeId) { conditions.push('id != $' + (values.length+1)); values.push(excludeId); }
    const result = await db.query('SELECT * FROM exams WHERE ' + conditions.join(' AND '), values);
    return result.rows;
  },
};
module.exports = ExamModel;
