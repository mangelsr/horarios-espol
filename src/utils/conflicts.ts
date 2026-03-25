import type { ScheduleSlot, ExamSlot, SelectedParallel } from '../types'

/**
 * Converts seconds-from-midnight to "HH:MM" string
 */
export function secondsToTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Parses ISO 8601 Duration string (e.g., "PT8H", "PT12H30M") to seconds from midnight
 */
export function parseISO8601Duration(duration: string): number {
  if (!duration || !duration.startsWith('PT')) return 0
  
  const hoursMatch = duration.match(/(\d+)H/)
  const minutesMatch = duration.match(/(\d+)M/)
  const secondsMatch = duration.match(/(\d+)S/)

  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0
  const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Returns true if two time ranges overlap (endpoints touching is NOT a conflict)
 */
function rangesOverlap(
  startA: number, endA: number,
  startB: number, endB: number
): boolean {
  return startA < endB && endA > startB
}

/**
 * Check if a new schedule (list of slots) conflicts with any already selected parallel
 */
export function hasTimeConflict(
  newSlots: ScheduleSlot[],
  selected: SelectedParallel[]
): SelectedParallel | null {
  for (const existing of selected) {
    for (const newSlot of newSlots) {
      for (const existSlot of existing.schedule) {
        if (
          newSlot.nombredia === existSlot.nombredia &&
          rangesOverlap(newSlot.horainicio, newSlot.horafin, existSlot.horainicio, existSlot.horafin)
        ) {
          return existing
        }
      }
    }
  }
  return null
}

/**
 * Check if a new exam schedule conflicts with any already selected parallel
 * Compares by fecha + time range if available, falls back to string comparison
 */
export function hasExamConflict(
  newExams: ExamSlot[],
  selected: SelectedParallel[]
): SelectedParallel | null {
  for (const existing of selected) {
    for (const newExam of newExams) {
      for (const existExam of existing.exams) {
        const sameDay = newExam.fecha
          ? newExam.fecha === existExam.fecha
          : newExam.nombredia === existExam.nombredia

        if (
          sameDay &&
          newExam.horainicio !== undefined &&
          newExam.horafin !== undefined &&
          existExam.horainicio !== undefined &&
          existExam.horafin !== undefined &&
          rangesOverlap(
            newExam.horainicio as number,
            newExam.horafin as number,
            existExam.horainicio as number,
            existExam.horafin as number
          )
        ) {
          return existing
        }
      }
    }
  }
  return null
}

/** Palette of colors for subjects */
export const SUBJECT_COLORS = [
  '#0d9488', // teal-600
  '#0284c7', // sky-600
  '#4f46e5', // indigo-600
  '#be123c', // rose-700
  '#b45309', // amber-700
  '#15803d', // green-700
  '#7c3aed', // violet-600
  '#0891b2', // cyan-600
  '#c026d3', // fuchsia-600
  '#e11d48', // rose-600
]

export function getSubjectColor(index: number): string {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length]
}

/** Map day names to column indexes (Mon=0 ... Sat=5) */
export const DAY_MAP: Record<string, number> = {
  LUNES: 0,
  MARTES: 1,
  MIERCOLES: 2,
  MIÉRCOLES: 2,
  JUEVES: 3,
  VIERNES: 4,
  SABADO: 5,
  SÁBADO: 5,
}

export const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']

/** Build hour range for the grid (7:00 - 22:00) */
export const GRID_START = 7 * 3600  // 7:00 AM
export const GRID_END = 22 * 3600   // 10:00 PM
export const SLOT_MINUTES = 30
export const SLOT_SECONDS = SLOT_MINUTES * 60
