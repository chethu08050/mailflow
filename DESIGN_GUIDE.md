# MailFlow Pro Design Guide

## Visual Identity

### Color Scheme

#### Primary Colors
- **Primary**: `#4F46E5` - Indigo (Main brand color)
- **Primary Dark**: `#4338CA` - Darker Indigo (Hover states, accents)
- **Primary Light**: `#C7D2FE` - Light Indigo (Backgrounds, subtle highlights)

#### Secondary Colors
- **Secondary**: `#10B981` - Emerald (Success states, positive actions)
- **Warning**: `#F59E0B` - Amber (Warnings, pending states)
- **Danger**: `#EF4444` - Red (Errors, destructive actions)

#### Neutral Colors
- **Dark**: `#1E293B` - Slate (Headings, primary text)
- **Light**: `#F8FAFC` - Light Slate (Page backgrounds)
- **Gray**: `#64748B` - Gray (Secondary text, placeholders)
- **Light Gray**: `#E2E8F0` - Light Gray (Borders, dividers)

### Typography

#### Font Families
- **Headings**: Poppins (Clean, modern sans-serif)
- **Body Text**: Inter (Highly readable sans-serif)

#### Font Sizes
- **H1**: 3rem (Hero titles)
- **H2**: 2.5rem (Section titles)
- **H3**: 1.8rem (Card titles)
- **H4**: 1.25rem (Subheadings)
- **Body**: 1rem (Default text)
- **Small**: 0.875rem (Captions, labels)

#### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Spacing System

- **XS**: 0.5rem (8px)
- **SM**: 1rem (16px)
- **MD**: 1.5rem (24px)
- **LG**: 2rem (32px)
- **XL**: 3rem (48px)
- **XXL**: 4rem (64px)

### Border Radius

- **Small**: 0.5rem (8px) - Buttons, badges
- **Medium**: 1rem (16px) - Cards, containers
- **Large**: 1.5rem (24px) - Hero sections, large components

### Shadows

- **Small**: `0 1px 3px rgba(0, 0, 0, 0.1)` - Subtle depth
- **Medium**: `0 4px 6px rgba(0, 0, 0, 0.1)` - Cards, hover states
- **Large**: `0 10px 15px rgba(0, 0, 0, 0.1)` - Modals, floating elements

## Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  background-color: var(--primary);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  border: none;
  cursor: pointer;
}
```

#### Outline Button
```css
.btn-outline {
  background-color: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
}
```

### Cards

#### Feature Card
```css
.feature-card {
  background: var(--light);
  border-radius: var(--radius-md);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
```

#### Pricing Card
```css
.pricing-card {
  background: var(--light);
  border-radius: var(--radius-md);
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
```

### Forms

#### Input Fields
```css
.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--radius-sm);
  font-family: var(--font-secondary);
  font-size: 1rem;
}
```

### Navigation

#### Header Navigation
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
  padding: 1rem 0;
}
```

## Layout Guidelines

### Grid System
- **Container Width**: Max 1200px with 90% width
- **Gutters**: 2rem between columns
- **Responsive Breakpoints**:
  - Mobile: 576px
  - Tablet: 768px
  - Desktop: 992px

### Section Spacing
- **Section Padding**: 6rem top/bottom for main sections
- **Component Gaps**: 2rem between elements
- **Card Spacing**: 1.5rem padding inside cards

## Iconography

### Icon Set
- **Library**: Font Awesome 6
- **Style**: Solid and Regular variants
- **Sizes**: 
  - Small: 1rem
  - Medium: 1.5rem
  - Large: 2rem

### Icon Usage
- **Feature Icons**: 1.5rem with circular background
- **Navigation Icons**: 1.2rem
- **Button Icons**: 1rem inline with text

## Animations & Transitions

### Hover Effects
- **Buttons**: `transform: translateY(-2px)` with shadow enhancement
- **Cards**: `transform: translateY(-10px)` with shadow enhancement
- **Links**: Color transition with `var(--transition)`

### Interactive States
- **Accordion**: Smooth height transition
- **Tabs**: Fade transition between content
- **Modals**: Scale and fade in/out

## Dark Mode Implementation

### Color Mapping
- **Background**: `#0F172A` (Dark Slate)
- **Cards**: `#1E293B` (Slate)
- **Text**: `#F8FAFC` (Light Slate)
- **Accents**: `#C7D2FE` (Light Indigo)

### Toggle Position
- Fixed position in bottom-right corner
- Circular button with moon/sun icon
- Persistent across all pages

## Wireframe Concepts

### Homepage Structure
```
-------------------------------------
| Header (Logo + Nav + Buttons)     |
-------------------------------------
| Hero (Title + Description + CTA)  |
| Dashboard Mockup                  |
-------------------------------------
| Features (8 cards in grid)        |
-------------------------------------
| How It Works (3 steps)            |
-------------------------------------
| Pricing (3 tiers)                 |
-------------------------------------
| Testimonials (3 cards)            |
-------------------------------------
| CTA Banner                        |
-------------------------------------
| Footer (4 columns + Legal)        |
-------------------------------------
```

### Dashboard Layout
```
-------------------------------------
| Sidebar | Top Bar (Search, etc)   |
|         |-------------------------|
|         | Stats Overview (4 cards)|
|         |-------------------------|
|         | Charts (2 columns)      |
|         |-------------------------|
|         | Recent Campaigns Table  |
|         |-------------------------|
|         | Contact Lists (4 cards) |
-------------------------------------
```

### Contact Page Layout
```
-------------------------------------
| Header                            |
-------------------------------------
| Contact Hero (Title + Desc)       |
-------------------------------------
| Contact Info    | Contact Form    |
-------------------------------------
| FAQ Section                       |
-------------------------------------
| CTA Banner                        |
-------------------------------------
| Footer                            |
-------------------------------------
```

## Accessibility Considerations

### Contrast Ratios
- Text against background: Minimum 4.5:1
- Large text: Minimum 3:1
- Interactive elements: Clear focus states

### Keyboard Navigation
- All interactive elements accessible via Tab
- Logical tab order following visual layout
- Skip to content link for screen readers

### Semantic HTML
- Proper heading hierarchy (H1-H4)
- Landmark elements (header, main, footer)
- Descriptive alt text for images
- Form labels associated with inputs

## Performance Optimization

### CSS Best Practices
- Minified production stylesheet
- Critical CSS for above-the-fold content
- Efficient selectors and minimal nesting

### Image Optimization
- Placeholder images for demonstration
- Production implementation should use optimized formats
- Lazy loading for off-screen images

### JavaScript Efficiency
- Minimal DOM manipulation
- Event delegation where appropriate
- Debounced scroll handlers