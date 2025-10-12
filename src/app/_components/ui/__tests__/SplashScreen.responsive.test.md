# SplashScreen Responsive Testing Guide

## Overview

This document outlines the responsive behavior of the SplashScreen component and provides testing guidelines for different screen sizes and orientations.

## Responsive Breakpoints

### Mobile Devices (Portrait)

- **Extra Small (≤375px)**: iPhone SE, small Android phones

  - Logo: 1.5rem - 2rem
  - Loader: 28px × 28px
  - Margin: 1.25rem

- **Small (376px - 640px)**: iPhone 12/13/14, standard Android phones
  - Logo: 1.75rem - 2.5rem
  - Loader: 32px × 32px
  - Margin: 1.5rem

### Mobile Devices (Landscape)

- **Landscape (≤896px, landscape orientation)**
  - Logo: 1.5rem - 2rem (using vh units)
  - Loader: 28px × 28px
  - Reduced margins for better fit

### Tablets

- **Portrait (641px - 768px)**: iPad Mini, small tablets

  - Logo: 2rem - 2.75rem
  - Loader: 36px × 36px
  - Margin: 1.75rem

- **Landscape (769px - 1024px)**: iPad, standard tablets

  - Logo: 2.25rem - 3rem
  - Loader: 38px × 38px
  - Margin: 1.75rem

- **Landscape Orientation Specific (641px - 1024px, landscape)**
  - Logo: 2rem - 2.5rem (using vh units)
  - Loader: 32px × 32px
  - Reduced margins

### Desktop

- **Standard (1025px - 1439px)**: Laptops, small desktops

  - Logo: 2.5rem - 3.5rem
  - Loader: 40px × 40px
  - Margin: 2rem
  - Max width: 600px

- **Large (1440px - 1919px)**: Large desktops, iMac

  - Logo: 3.5rem
  - Loader: 44px × 44px
  - Margin: 2.25rem

- **Ultra-wide/4K (≥1920px)**: 4K displays, ultra-wide monitors
  - Logo: 4rem
  - Loader: 48px × 48px
  - Margin: 2.5rem
  - Max width: 800px

## Testing Checklist

### Requirement 5.1: Mobile Devices

- [ ] Test on iPhone SE (375px × 667px)
- [ ] Test on iPhone 12/13/14 (390px × 844px)
- [ ] Test on Samsung Galaxy S21 (360px × 800px)
- [ ] Verify text is readable and not truncated
- [ ] Verify loader is visible and properly sized
- [ ] Verify proper spacing and centering

### Requirement 5.2: Tablets

- [ ] Test on iPad Mini (768px × 1024px portrait)
- [ ] Test on iPad Pro (1024px × 1366px portrait)
- [ ] Test on iPad (1024px × 768px landscape)
- [ ] Verify layout adapts appropriately
- [ ] Verify text scaling is optimal
- [ ] Verify loader size is appropriate

### Requirement 5.3: Desktop

- [ ] Test on 1366px × 768px (common laptop)
- [ ] Test on 1920px × 1080px (Full HD)
- [ ] Test on 2560px × 1440px (2K)
- [ ] Test on 3840px × 2160px (4K)
- [ ] Verify elements are centered
- [ ] Verify text doesn't become too large
- [ ] Verify max-width constraints work

### Requirement 5.4: Orientation Changes

- [ ] Test mobile portrait → landscape transition
- [ ] Test mobile landscape → portrait transition
- [ ] Test tablet portrait → landscape transition
- [ ] Test tablet landscape → portrait transition
- [ ] Verify layout maintains proper structure
- [ ] Verify no content overflow or clipping
- [ ] Verify animations still work smoothly

### Requirement 5.5: Proportions and Readability

- [ ] Verify text remains readable at all sizes
- [ ] Verify loader remains visible and proportional
- [ ] Verify spacing ratios are maintained
- [ ] Verify no text overflow or truncation
- [ ] Verify proper word wrapping on long names
- [ ] Verify centering works across all viewports

## Browser Testing

### Desktop Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers

- [ ] Safari iOS (iPhone)
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet
- [ ] Firefox Mobile

## Manual Testing Steps

1. **Open Developer Tools**

   - Press F12 or right-click → Inspect

2. **Enable Device Toolbar**

   - Click the device icon or press Ctrl+Shift+M (Cmd+Shift+M on Mac)

3. **Test Each Breakpoint**

   - Select preset devices or enter custom dimensions
   - Reload the page to see splash screen
   - Verify layout, sizing, and centering

4. **Test Orientation Changes**

   - Use device toolbar rotation button
   - Or manually resize browser window
   - Verify smooth transitions

5. **Test on Real Devices**
   - Use actual phones and tablets when possible
   - Test both portrait and landscape
   - Verify touch interactions work

## Expected Behavior

### All Screen Sizes

- Splash screen should fill entire viewport
- Content should be vertically and horizontally centered
- Logo text should be readable and not truncated
- Loader should be visible and spinning (unless reduced motion)
- Background should cover entire screen
- No scrollbars should appear

### Responsive Scaling

- Text size should scale smoothly using clamp()
- Loader size should be proportional to text
- Spacing should maintain visual hierarchy
- Max-width constraints prevent excessive sizing on large screens

### Dynamic Viewport Height

- Uses `100dvh` for mobile browsers with dynamic toolbars
- Ensures splash screen fills visible area even when address bar is visible

## Common Issues and Solutions

### Issue: Text too small on mobile

- **Solution**: Implemented clamp() with appropriate min/max values
- **Verification**: Check font-size in DevTools

### Issue: Text too large on desktop

- **Solution**: Added max-width constraints and upper bounds in clamp()
- **Verification**: Test on 4K displays

### Issue: Layout breaks on orientation change

- **Solution**: Added specific landscape media queries
- **Verification**: Rotate device or use DevTools rotation

### Issue: Content not centered on some devices

- **Solution**: Used flexbox with proper alignment
- **Verification**: Test on various aspect ratios

### Issue: Loader too small/large

- **Solution**: Scaled loader proportionally to text size
- **Verification**: Visual inspection across breakpoints

## Automated Testing Notes

While this is primarily a visual feature requiring manual testing, consider:

- Screenshot comparison tests for different viewports
- Automated accessibility tests for text contrast
- Performance tests for animation smoothness
- Unit tests for responsive class application

## Requirements Coverage

- ✅ **5.1**: Mobile devices display properly scaled splash screen
- ✅ **5.2**: Tablets adapt splash screen layout appropriately
- ✅ **5.3**: Desktop centers and scales elements optimally
- ✅ **5.4**: Orientation changes maintain proper layout
- ✅ **5.5**: Text and graphics remain readable and proportioned
