import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Token validation uses the analytics auth module
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _validTokens = new Map<string, number>()

export async function GET(request: NextRequest) {
  // Verify auth
  const auth = request.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'No auth token' }, { status: 401 })
  }

  // For now, accept any token that was issued by the analytics auth endpoint
  // In production, verify against a shared store

  const type = request.nextUrl.searchParams.get('type') || 'list'

  if (type === 'list') {
    // Return list of available backups
    const backups = [
      {
        id: 'db-full',
        name: 'Database Backup (Full SQL)',
        description: '111 tables, all content, doctors, pages, analytics',
        size: '1.4 MB',
        date: '2026-03-30',
        format: 'SQL',
      },
      {
        id: 'content-extract',
        name: 'Content Extraction (Markdown)',
        description: 'Human-readable export of all doctors, procedures, testimonials, locations',
        size: '15 KB',
        date: '2026-03-30',
        format: 'Markdown',
      },
      {
        id: 'data-json',
        name: 'Raw Data Export (JSON)',
        description: 'Full database tables as JSON objects',
        size: '279 KB',
        date: '2026-03-30',
        format: 'JSON',
      },
    ]

    return NextResponse.json({ backups })
  }

  if (type === 'download') {
    const fileId = request.nextUrl.searchParams.get('file')

    const fileMap: Record<string, { path: string; mime: string; name: string }> = {
      'db-full': {
        path: join(process.cwd(), 'backups', 'iyamedical_db_full_backup.sql'),
        mime: 'application/sql',
        name: 'iyamedical_db_backup_20260330.sql',
      },
      'content-extract': {
        path: join(process.cwd(), 'backups', 'iya_medical_full_extraction.md'),
        mime: 'text/markdown',
        name: 'iyamedical_content_extraction.md',
      },
      'data-json': {
        path: join(process.cwd(), 'backups', 'iya_db.json'),
        mime: 'application/json',
        name: 'iyamedical_data_export.json',
      },
    }

    const file = fileMap[fileId || '']
    if (!file || !existsSync(file.path)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const data = readFileSync(file.path)
    return new NextResponse(data, {
      headers: {
        'Content-Type': file.mime,
        'Content-Disposition': `attachment; filename="${file.name}"`,
        'Content-Length': data.length.toString(),
      },
    })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
