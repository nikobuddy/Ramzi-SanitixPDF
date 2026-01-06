# 📁 Project Structure

This document describes the clean, organized structure of the SanitixPDF project.

## 🎯 Organization Principles

1. **Root Directory**: Only essential files (README, LICENSE, config files)
2. **Documentation**: All docs in `docs/` folder
3. **Scripts**: All utility scripts in `scripts/` folder
4. **NPM Package**: Self-contained in `npm-package/` with its own docs
5. **Clean GitHub View**: Professional structure visible on GitHub

---

## 📂 Directory Structure

### Root Level (Essential Files Only)

```
SanitixPDF/
├── README.md              # Main project README
├── LICENSE                # MIT License
├── requirements.txt      # Python dependencies
├── setup.py              # Python package setup
├── pyproject.toml        # Modern Python config
├── CHANGELOG.md          # Version history
├── AUTHORS.md            # Project authors
│
├── app.py                # Flask web application
├── duplicate_pdf_detector.py  # Core engine
├── config.py             # Configuration
├── wsgi.py               # Production WSGI
├── verify_setup.py       # Setup verification
│
├── QUICKSTART.md         # Quick start (essential)
├── DEPLOYMENT.md         # Deployment (essential)
├── CONTRIBUTING.md       # Contributing (essential)
├── CODE_OF_CONDUCT.md    # Code of conduct (essential)
├── SECURITY.md           # Security policy (essential)
│
├── .gitignore            # Git ignore rules
├── .github/              # GitHub config
└── PROJECT_STRUCTURE.md   # This file
```

### Documentation (`docs/`)

```
docs/
├── README.md                    # Documentation index
├── PROJECT_SUMMARY.md          # Project overview
├── RELEASE_NOTES.md            # Release notes
├── PRODUCTION_CHECKLIST.md     # Production checklist
├── SHARE_PACKAGE.md            # Sharing guide
├── ALL_DONE.md                 # Completion summary
│
└── development/                # Development docs
    ├── GITHUB_ACTIONS_FIX.md
    ├── GITHUB_READY.md
    ├── GITHUB_SETUP.md
    ├── WORKFLOW_FIXES.md
    ├── FINAL_WORKFLOW_FIX.md
    └── PYTHON37_FIX.md
```

### Scripts (`scripts/`)

```
scripts/
├── README.md              # Scripts documentation
├── run.sh                 # Run CLI detector
├── start.sh               # Start web server
└── CREATE_RELEASE.sh      # Create GitHub release
```

### NPM Package (`npm-package/`)

```
npm-package/
├── README.md              # Package README
├── package.json           # NPM config
├── tsconfig.json          # TypeScript config
├── LICENSE                # MIT License
│
├── src/                   # Source code
│   ├── index.ts
│   ├── core/
│   ├── hooks/
│   ├── context/
│   └── types/
│
├── lib/                   # Compiled output
├── examples/              # Usage examples
│
├── docs/                  # NPM package docs
│   ├── README.md
│   ├── NPM_PACKAGE_SUMMARY.md
│   ├── NPM_PUBLISH_GUIDE.md
│   ├── PUBLISH_WITH_2FA.md
│   └── ...
│
└── scripts/               # Publishing scripts
    ├── publish.sh
    └── QUICK_PUBLISH.sh
```

### Web Interface

```
templates/
└── index.html            # Web interface HTML

static/
├── css/
│   └── style.css        # Styles
└── js/
    └── app.js           # JavaScript
```

### GitHub Configuration (`.github/`)

```
.github/
├── ISSUE_TEMPLATE/      # Issue templates
├── workflows/           # GitHub Actions
├── PULL_REQUEST_TEMPLATE.md
└── FUNDING.yml
```

---

## 🎨 Clean GitHub View

When someone opens your repository on GitHub, they'll see:

1. **README.md** - Clear project overview
2. **Essential docs** - Quick start, deployment, contributing
3. **Clean structure** - Organized folders, not cluttered
4. **Professional** - Production-ready appearance

---

## 📝 File Organization Rules

### ✅ Keep in Root
- Main README.md
- LICENSE
- Essential config files (requirements.txt, setup.py)
- Essential documentation (QUICKSTART, DEPLOYMENT, CONTRIBUTING)
- Core application files

### 📚 Move to `docs/`
- Project summaries
- Release notes
- Development guides
- Troubleshooting docs
- Sharing guides

### 🔧 Move to `scripts/`
- All shell scripts
- Utility scripts
- Build scripts

### 📦 NPM Package
- Self-contained in `npm-package/`
- Own documentation in `npm-package/docs/`
- Own scripts in `npm-package/scripts/`

---

## 🚀 Benefits of This Structure

1. **Professional**: Clean, organized appearance
2. **Discoverable**: Easy to find files
3. **Maintainable**: Clear organization
4. **Scalable**: Easy to add new files
5. **GitHub-Friendly**: Looks great on GitHub

---

## 📖 Quick Reference

- **Main README**: [README.md](README.md)
- **Documentation**: [docs/](docs/)
- **Scripts**: [scripts/](scripts/)
- **NPM Package**: [npm-package/](npm-package/)

---

**This structure makes the project professional and easy to navigate!** 🎯

