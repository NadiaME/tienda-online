export interface PageSection {
    type: string
    props?: Record<string, any>
}

export interface PageData {
    sections: PageSection[]
}