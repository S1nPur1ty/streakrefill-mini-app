/**
 * Design System Style Guide
 * 
 * This file contains design tokens and styling utilities to maintain
 * consistency across the application.
 */

// Color palette
export const colors = {
  // Primary brand colors
  primary: 'var(--color-primary)', // Green from current implementation
  secondary: 'var(--color-secondary)', // Currently used as hover state
  
  // Background colors
  background: {
    main: '#0f172a', // bg-gray-950
    card: '#1e293b', // bg-gray-800
    cardHover: '#334155', // bg-gray-700
    cardDark: '#1f2937', // bg-gray-900
  },
  
  // Border colors
  border: {
    light: '#334155', // border-gray-700
    dark: '#1f2937', // border-gray-800
  },
  
  // Text colors
  text: {
    primary: '#ffffff', // text-white
    secondary: '#94a3b8', // text-gray-400
    tertiary: '#64748b', // text-gray-500
    inverse: '#000000', // text-black (on primary/buttons)
  },
  
  // Semantic colors
  semantic: {
    success: '#22c55e', // text-green-500
    warning: '#eab308', // text-yellow-500
    error: '#ef4444', // text-red-500
    info: '#3b82f6', // text-blue-500
  },
  
  // Feature colors
  feature: {
    streak: '#f97316', // text-orange-500 (Fire icon)
    trophy: '#eab308', // text-yellow-500 (Trophy icon)
    spending: '#22c55e', // text-green-500 (Money icon)
    spinner: '#a855f7', // text-purple-500 (CircleNotch icon)
    rewards: '#3b82f6', // text-blue-500 (Gift icon)
  },
};

// Spacing system (in pixels and rem)
export const spacing = {
  xs: 'p-2', // 0.5rem
  sm: 'p-3', // 0.75rem
  md: 'p-4', // 1rem
  lg: 'p-5', // 1.25rem
  xl: 'p-6', // 1.5rem
  
  // Specific padding presets
  card: 'p-4', // Standard card padding
  cardLarge: 'p-5', // Larger card padding for more important cards
  section: 'p-4 pb-24', // Section padding with bottom for navigation
  
  // Gap presets
  gapXs: 'gap-2',
  gapSm: 'gap-3',
  gapMd: 'gap-4',
  gapLg: 'gap-5',
  
  // Margin presets
  marginXs: 'm-2',
  marginSm: 'm-3',
  marginMd: 'm-4',
  marginBottom: 'mb-4',
};

// Typography
export const typography = {
  // Heading styles
  heading: {
    h1: 'text-2xl font-bold text-white',
    h2: 'text-xl font-semibold text-white',
    h3: 'text-lg font-semibold text-white',
    sectionTitle: 'text-xl font-semibold text-white mb-4',
    pageTitle: 'text-2xl font-bold text-white mb-2',
  },
  
  // Body text styles
  body: {
    regular: 'text-sm text-gray-300',
    secondary: 'text-sm text-gray-400',
    small: 'text-xs text-gray-400',
    caption: 'text-xs text-gray-500',
  },
  
  // Stat numbers
  stats: {
    large: 'text-3xl font-bold',
    medium: 'text-2xl font-bold',
    small: 'text-xl font-bold',
  },
};

// Borders and Shadows
export const borders = {
  card: 'border border-gray-700 rounded-2xl',
  cardSmall: 'border border-gray-700 rounded-xl',
  inputField: 'border border-gray-700 rounded-lg',
  button: 'rounded-xl',
  buttonSmall: 'rounded-lg',
  pill: 'rounded-full',
};

// Component styles
export const components = {
  // Button styles
  button: {
    primary: 'bg-primary hover:bg-secondary text-black font-medium transition-colors',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors',
    small: 'px-4 py-2 rounded-lg text-sm',
    medium: 'px-4 py-3 rounded-xl text-sm',
    large: 'px-6 py-3 rounded-xl',
  },
  
  // Card styles
  card: {
    default: 'bg-gray-800 rounded-2xl p-4 border border-gray-700',
    highlight: 'bg-gray-800 rounded-2xl p-5 border border-gray-700',
    interactive: 'bg-gray-800 hover:bg-gray-700 rounded-2xl p-4 border border-gray-700 transition-colors',
    small: 'bg-gray-800 rounded-xl p-3 border border-gray-700',
  },
  
  // Layout styles
  layout: {
    section: 'flex-1 p-4 pb-24',
    container: 'max-w-2xl mx-auto space-y-6',
    grid2: 'grid grid-cols-2 gap-4',
    grid3: 'grid grid-cols-3 gap-4',
    flex: 'flex items-center',
    flexBetween: 'flex items-center justify-between',
    flexColumn: 'flex flex-col',
  },
  
  // Icon styles
  icon: {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    feature: 'w-10 h-10 rounded-full flex items-center justify-center',
    featureLarge: 'w-12 h-12 rounded-full flex items-center justify-center',
  },
};

// Common style combinations
export const stylePresets = {
  pageContainer: `${components.layout.section}`,
  contentContainer: `${components.layout.container}`,
  
  cardTitle: `${typography.heading.sectionTitle} flex items-center gap-2`,
  
  pageHeader: `pb-4`,
  pageHeaderTitle: typography.heading.pageTitle,
  pageHeaderDescription: 'text-gray-400',
  
  statCard: `${components.card.default}`,
  statCardIcon: `${components.icon.featureLarge} mb-2`,
  statCardValue: `${typography.stats.large} mb-1`,
  statCardLabel: `text-sm text-gray-400`,
  
  gridLayout: components.layout.grid2,
  
  // List item presets
  listItem: `${components.card.small} flex items-center justify-between`,
  listItemActive: `${components.card.small} flex items-center justify-between border-primary/50`,
  listItemIcon: `${components.icon.medium}`,
  listItemContent: `flex items-center gap-3`,
};

// Helper for generating style classes
export const createStyleClass = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export default {
  colors,
  spacing,
  typography,
  borders,
  components,
  stylePresets,
  createStyleClass,
}; 