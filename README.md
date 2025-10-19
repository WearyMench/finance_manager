# Expense Manager - Landing Page

A modern, responsive landing page for the Expense Manager mobile application. This website serves as the official web presence for the app, providing information about features, screenshots, download links, and legal documentation required for Google Play Store verification.

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Internationalization**: Support for English and Spanish with automatic language detection
- **Modern UI**: Clean, professional design matching the app's branding
- **SEO Optimized**: Proper meta tags, structured data, and semantic HTML
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized images, lazy loading, and efficient CSS/JS

## Pages

- **Home** (`index.html`): Main landing page with app features and information
- **FAQ** (`faq.html`): Frequently asked questions with search and filtering
- **Terms of Service** (`terms.html`): Legal terms and conditions
- **Privacy Policy** (`privacy.html`): Privacy policy and data handling information

## Structure

```
Front/
├── index.html              # Main landing page
├── faq.html                # FAQ page
├── terms.html              # Terms of Service
├── privacy.html            # Privacy Policy
├── README.md               # This file
└── assets/
    ├── css/
    │   ├── style.css       # Main styles
    │   ├── responsive.css  # Responsive design
    │   ├── legal.css       # Legal pages styles
    │   └── faq.css         # FAQ page styles
    ├── js/
    │   ├── main.js         # Main functionality
    │   ├── i18n.js         # Internationalization
    │   └── faq.js          # FAQ functionality
    ├── i18n/
    │   ├── en.json         # English translations
    │   └── es.json         # Spanish translations
    └── images/
        ├── logo.png        # App logo
        ├── app-preview.png # App preview image
        ├── screenshot-*.png # App screenshots
        ├── google-play-badge.png # Google Play badge
        └── favicon-*.png   # Favicon files
```

## Setup

1. **Clone or download** the project files
2. **Add images** to the `assets/images/` directory:
   - `logo.png` - App logo (recommended: 200x200px)
   - `app-preview.png` - App preview for hero section (recommended: 300x600px)
   - `screenshot-1.png` to `screenshot-4.png` - App screenshots
   - `google-play-badge.png` - Google Play Store badge
   - `favicon-32x32.png` and `favicon-16x16.png` - Favicon files
3. **Deploy** to your web server or hosting service

## Customization

### Colors

The app uses a consistent color scheme defined in CSS variables:

- Primary: `#7091CE` (soft blue)
- Secondary: `#BFDFFF` (light blue)
- Success: `#10B981` (green)
- Error: `#EF4444` (red)

### Content

- Update app information in the HTML files
- Modify translations in the `assets/i18n/` JSON files
- Replace placeholder images with actual app screenshots

### Google Play Store Integration

- Update the Google Play Store URL in `index.html`
- Ensure the app package name matches your actual app
- Add proper app store metadata

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images with WebP format support
- Minified CSS and JavaScript (for production)
- Lazy loading for images
- Efficient font loading
- Minimal external dependencies

## SEO Features

- Semantic HTML structure
- Meta tags for social sharing
- Open Graph and Twitter Card support
- Structured data markup
- Sitemap ready
- Mobile-friendly design

## Legal Compliance

- GDPR compliant privacy policy
- Terms of service for app usage
- Cookie policy integration ready
- Accessibility compliance (WCAG 2.1)

## Deployment

### Static Hosting

This is a static website that can be deployed to:

- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any web server

### Domain Setup

- Point your domain to the hosting service
- Configure SSL certificate
- Set up redirects if needed

## Maintenance

- Update app screenshots when releasing new versions
- Keep legal documents current
- Monitor performance and user feedback
- Update translations as needed

## Support

For technical support or questions about this landing page, contact:

- Email: support@expensemanager.app

## License

This landing page is part of the Expense Manager project. All rights reserved.
