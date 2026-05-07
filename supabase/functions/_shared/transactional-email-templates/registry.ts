/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as appointmentNotification } from './appointment-notification.tsx'
import { template as quoteNotification } from './quote-notification.tsx'
import { template as simplaHealthAlert } from './simpla-health-alert.tsx'
import { template as simplaHealthRecovery } from './simpla-health-recovery.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'appointment-notification': appointmentNotification,
  'quote-notification': quoteNotification,
  'simpla-health-alert': simplaHealthAlert,
  'simpla-health-recovery': simplaHealthRecovery,
}
