import { MantineThemeOverride } from '@mantine/core'

// Brand colors - using a scholarly but modern palette
export const theme: MantineThemeOverride = {
  primaryColor: 'indigo',
  // Custom colors can be defined here
  colors: {
    'mondo-blue': [
      '#E9EDFF', // 0: Lightest
      '#D1D9FF',
      '#B3C0FF',
      '#8FA0FF',
      '#6B80FF', // 4: Primary
      '#4D63FF',
      '#334DFF',
      '#1A3AFF',
      '#0026FF',
      '#0020DB', // 9: Darkest
    ],
    'mondo-gray': [
      '#F8F9FA',
      '#E9ECEF',
      '#DEE2E6',
      '#CED4DA',
      '#ADB5BD',
      '#6C757D',
      '#495057',
      '#343A40',
      '#212529',
      '#121416',
    ],
  },

  // Global styles
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
  },

  // Component defaults
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
  },

  // Other theme configurations
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
  },

  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  // Default radius
  defaultRadius: 'md',
}
