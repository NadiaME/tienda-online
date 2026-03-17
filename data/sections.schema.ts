type SectionSchema = {
    props: Record<string, string>
}

export const sectionsSchema: Record<string, SectionSchema> = {
    hero: {
        props: {
            title: 'string',
            subtitle: 'string',
            image: 'string'
        }
    },

    productGrid: {
        props: {
            title: 'string',
            limit: 'number'
        }
    },

    testimonials: {
        props: {
            items: 'array'
        }
    },

    cta: {
        props: {
            title: 'string',
            buttonText: 'string',
            buttonLink: 'string'
        }
    }
}