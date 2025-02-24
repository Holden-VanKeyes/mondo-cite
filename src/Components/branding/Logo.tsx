import { Text, Box, useMantineTheme } from '@mantine/core'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const theme = useMantineTheme()

  const sizes = {
    sm: { fontSize: 20, spacing: 1 },
    md: { fontSize: 24, spacing: 1.5 },
    lg: { fontSize: 32, spacing: 2 },
  }

  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
      }}
    >
      <Text
        component="span"
        style={{
          fontSize: sizes[size].fontSize,
          fontWeight: 700,
          letterSpacing: sizes[size].spacing,
          background: `linear-gradient(45deg, ${theme.colors['mondo-blue'][7]}, ${theme.colors['mondo-blue'][5]})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        MONDOCITE
      </Text>
    </Box>
  )
}
