# 🚀 Quick Start Guide - Brella Beauty

## Get Running in 5 Minutes

### Step 1: Install Dependencies (1 minute)

```bash
cd "d:\Brella Beauty"
npm install
```

### Step 2: Create Admin User (30 seconds)

```bash
npm run seed:admin
```

### Step 3: Start Development Server (10 seconds)

```bash
npm run dev
```

### Step 4: Login to Admin Panel (1 minute)

1. Open http://localhost:3000/admin/login
2. Email: `admin@brellabeauty.com`
3. Password: `admin123`

### Step 5: Copy Components from Qyra Noor (2 minutes)

**Quick copy script (Windows PowerShell):**

```powershell
# Copy all components
Copy-Item -Path "d:\Qyra Noor\components\admin\*" -Destination "d:\Brella Beauty\components\admin\" -Recurse -Force
Copy-Item -Path "d:\Qyra Noor\components\home\*" -Destination "d:\Brella Beauty\components\home\" -Recurse -Force
Copy-Item -Path "d:\Qyra Noor\components\layout\*" -Destination "d:\Brella Beauty\components\layout\" -Recurse -Force
Copy-Item -Path "d:\Qyra Noor\components\product\*" -Destination "d:\Brella Beauty\components\product\" -Recurse -Force
Copy-Item -Path "d:\Qyra Noor\components\shop\*" -Destination "d:\Brella Beauty\components\shop\" -Recurse -Force
Copy-Item -Path "d:\Qyra Noor\components\ui\*" -Destination "d:\Brella Beauty\components\ui\" -Recurse -Force

# Copy admin pages
Copy-Item -Path "d:\Qyra Noor\app\admin\(panel)\categories" -Destination "d:\Brella Beauty\app\admin\(panel)\" -Recurse -Force
Copy-Item -Path "d:\Qyra Noor\app\admin\(panel)\subcategories" -Destination "d:\Brella Beauty\app\admin\(panel)\" -Recurse -Force
Copy-Item -Path "d:\Qyra Noor\app\admin\(panel)\products" -Destination "d:\Brella Beauty\app\admin\(panel)\" -Recurse -Force
Copy-Item -Path "d:\Qyra Noor\app\admin\(panel)\homepage" -Destination "d:\Brella Beauty\app\admin\(panel)\" -Recurse -Force
```

### Step 6: Update Color Theme (Optional - 2 minutes)

Use Find & Replace in VS Code:

- Find: `gold` → Replace: `blush`
- Find: `warm-` → Replace: `mauve-`
- Find: `cream` → Replace: `pearl`

## ✅ You're Done!

Your Brella Beauty website is now running with:

- ✅ Full admin panel
- ✅ Product management
- ✅ Category management
- ✅ Homepage CMS
- ✅ Beautiful theme
- ✅ SEO optimization

## 📱 Test Your Site

1. **Homepage**: http://localhost:3000
2. **Shop**: http://localhost:3000/shop
3. **Admin**: http://localhost:3000/admin

## 🎯 Next Actions

1. Upload beauty product images via admin panel
2. Create categories (e.g., "Lip Products", "Face Makeup")
3. Add your first product
4. Customize homepage content
5. Update WhatsApp number

## 🆘 Issues?

See SETUP_GUIDE.md for detailed troubleshooting.

---

**🎨 Enjoy building your beauty empire! ✨**
