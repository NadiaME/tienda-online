import { sectionsSchema } from '@/data/sections.schema'

export type SectionType = keyof typeof sectionsSchema

export interface PageSection {
    type: SectionType
    props?: Record<string, any>
}

export interface PageData {
    sections: PageSection[]
}