export interface Project {
  id: number
  name: string
  site_code: string
  address: string
  status: 'active' | 'waiting' | 'done'
  progress_pct: number
  created_at: string
}

export interface Floor {
  id: number
  project_id: number
  name: string
  parts_delivered_pct: number
  constructions_total: number
  constructions_done: number
}

export interface Construction {
  id: number
  project_id: number
  floor_id: number
  code: string
  name: string
  status: 'ready' | 'done' | 'delivery' | 'shortage' | 'defect' | 'cancelled'
  parts_total: number
  parts_on_site: number
}

export interface Part {
  id: number
  construction_id: number
  number: number
  name_he: string
  name_ru: string | null
  dimensions: string
  material: string
  color: string
  status: 'done' | 'transit' | 'paint' | 'replace' | 'warehouse'
}

export interface Issue {
  id: number
  part_id: number
  construction_id: number
  type: 'damage' | 'replace' | 'paint' | 'missing' | 'other'
  comment: string
  urgency: 'high' | 'medium' | 'low'
  reported_by: string
  raw_input: string | null
  created_at: string
}

export interface ScanEvent {
  id: number
  part_id: number
  scanned_by: string
  location: string
  event: string
  created_at: string
}

export interface ParsedIssue {
  type: 'damage' | 'replace' | 'paint' | 'missing' | 'other'
  comment: string
  urgency: 'high' | 'medium' | 'low'
  confidence: 'high' | 'medium' | 'low'
  clarification_needed: string | null
}

// Navigation
export type Screen =
  | { name: 'home' }
  | { name: 'object'; projectId: number }
  | { name: 'floor'; floorId: number; projectId: number }
  | { name: 'construction'; constructionId: number }
  | { name: 'part'; partId: number }
  | { name: 'scanner' }
  | { name: 'settings' }
  | { name: 'login' }
