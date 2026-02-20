export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
  }
  radius: {
    base: string
  }
  logo: string
  storeName: string
}

export const themes = {
  tiendaA: {
    name: 'Tienda A',
    colors: {
      primary: '#111827',
      secondary: '#6366f1',
      text: '#111827',
      background: '#f9fafb'
    },
    radius: {
      base: '12px'
    },
    logo: '/logos/tiendaA.png',
    storeName: 'Tienda A'
  },

  tiendaB: {
    name: 'Tienda B',
    colors: {
      primary: '#7c3aed',
      secondary: '#f59e0b',
      text: '#000000',
      background: '#ffffff'
    },
    radius: {
      base: '6px'
    },
    logo: '/logos/tiendaB.png',
    storeName: 'Tienda B'
  }
} satisfies Record<string, ThemeConfig>
