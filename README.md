# Brella Beauty 💄

A premium beauty e-commerce website built with Next.js 14, featuring a complete admin panel with CMS capabilities. Focused on luxury beauty products, especially lip gloss.

## ✨ Features

- **Full CMS Admin Panel** - Complete control over all content
- **Product Management** - Categories, subcategories, products with variants
- **Homepage Customization** - Fully editable homepage sections
- **Image Uploads** - Integrated with UploadThing
- **SEO Optimized** - Meta tags, structured data, sitemap
- **WhatsApp Integration** - Easy ordering via WhatsApp
- **Responsive Design** - Beautiful on all devices
- **MongoDB Database** - Scalable and performant
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Custom beauty-themed design system

## 🎨 Design Theme

Beautiful rose gold, pink, and nude color palette perfect for beauty products:

- Rose Gold accents
- Blush pink highlights
- Pearl white backgrounds
- Mauve secondary colors
- Custom animations and effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (using existing connection)
- UploadThing account (using existing token)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Environment variables are already configured** in `.env.local`

3. **Seed the admin user:**

```bash
npm run seed:admin
```

This creates an admin user:

- Email: `admin@brellabeauty.com`
- Password: `admin123`

4. **Run development server:**

```bash
npm run dev
```

5. **Open your browser:**

```
http://localhost:3000
```

6. **Access admin panel:**

```
http://localhost:3000/admin/login
```

## 📁 Project Structure

```
brella-beauty/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── categories/   # Category management
│   │   ├── products/     # Product management
│   │   ├── subcategories/# Subcategory management
│   │   ├── homepage/     # Homepage settings
│   │   └── uploadthing/  # File uploads
│   ├── admin/            # Admin panel pages
│   │   ├── (auth)/       # Login
│   │   └── (panel)/      # Dashboard, CRUD pages
│   ├── products/         # Product pages
│   ├── shop/             # Shop listing
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── admin/            # Admin components
│   ├── home/             # Homepage sections
│   ├── layout/           # Header, Footer
│   ├── product/          # Product page components
│   └── shop/             # Shop page components
├── lib/                  # Utility functions
│   ├── auth.ts           # JWT authentication
│   ├── mongodb.ts        # Database connection
│   └── products.server.ts# Product queries
├── models/               # MongoDB schemas
│   ├── AdminUser.ts      # Admin user model
│   ├── Category.ts       # Category model
│   ├── Product.ts        # Product model
│   ├── Subcategory.ts    # Subcategory model
│   └── HomepageSettings.ts# Homepage CMS model
├── types/                # TypeScript types
└── scripts/              # Utility scripts
    └── seed-admin.ts     # Create admin user
```

## 🎯 Admin Panel Features

### Product Management

- Create, edit, delete products
- Multiple color variants with images
- Product descriptions, ingredients, benefits
- SEO meta tags
- Stock management
- Pricing control

### Category Management

- Create categories
- Upload category images
- Set display order
- Active/inactive toggle

### Homepage CMS

Control every section:

- Hero banner
- Marquee ticker
- Brand story
- Why choose us
- Testimonials
- WhatsApp CTA
- And more!

## 🛍️ Customer Features

- Beautiful product browsing
- Advanced filtering & search
- Product image galleries
- Detailed product information
- Customer reviews
- Related products
- WhatsApp quick order
- Mobile-responsive design

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run seed:admin   # Create admin user

# Linting
npm run lint         # Run ESLint
```

## 🎨 Color Palette

```css
Rose Gold: #d95138
Blush Pink: #f83d6f
Nude: #b89878
Mauve: #9e7d8b
Pearl: #faf9f7
```

## 🔒 Authentication

The admin panel uses JWT-based authentication with HTTP-only cookies. All admin routes are protected by middleware.

## 📱 WhatsApp Integration

Products link directly to WhatsApp with pre-filled messages for easy customer ordering.

## 🔧 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS
- **Authentication:** JWT (jose)
- **File Uploads:** UploadThing
- **Animation:** Framer Motion
- **Icons:** Lucide React

## 🚀 Deployment

1. Push to your Git repository
2. Deploy to Vercel, Netlify, or any Next.js host
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `UPLOADTHING_TOKEN`

## 📄 License

Private and Proprietary

## 💼 Support

For support, contact the development team.

---

**Built with ❤️ for Brella Beauty**
