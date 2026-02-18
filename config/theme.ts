export type Theme = {
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

export const themes: Record<string, Theme> = {
  default: {
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      text: '#111827',
      background: '#ffffff'
    },
    radius: {
      base: '12px'
    }
  }
}
