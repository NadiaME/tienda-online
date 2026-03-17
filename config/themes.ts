export interface Theme {
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
  }
  radius: {
    base: string
  }
}

export const themes = {
  tiendaA: {
    colors: {
      primary: '#000000',
      secondary: '#666666',
      text: '#111111',
      background: '#ffffff'
    },
    radius: {
      base: '12px'
    }
  },

  tiendaB: {
    colors: {
      primary: '#1e40af',
      secondary: '#9333ea',
      text: '#111827',
      background: '#f9fafb'
    },
    radius: {
      base: '8px'
    }
  }

} satisfies Record<string, Theme>

export type StoreId = keyof typeof themes