# Contributing to Chill the Ice Slime

Thank you for your interest in contributing! This is a minimal desktop pet POC built with Tauri v2.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Building and Testing](#building-and-testing)
- [Sprite Guidelines](#sprite-guidelines)
- [Commit Conventions](#commit-conventions)

## Getting Started

Before you start, make sure you have:

- **Rust 1.77.2+** (see [rustup.rs](https://rustup.rs/) for installation)
- **Node.js 22+** (for npm and Tauri CLI)
- **Git**

On Linux, you'll also need GTK development libraries. See [Development Setup](#development-setup) for platform-specific instructions.

## Development Setup

### Clone the Repository

```bash
git clone https://github.com/chillkimtest-oss/desktop-companion.git
cd desktop-companion
```

### Install Dependencies

Install npm dependencies:

```bash
npm install
```

This installs the Tauri CLI and API packages. Rust dependencies are managed by Cargo in the `src-tauri/` directory.

### Platform-Specific Requirements

#### Linux (Ubuntu/Debian)

Install required development libraries:

```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf \
  libgtk-3-dev
```

#### macOS

Xcode Command Line Tools are required. Install with:

```bash
xcode-select --install
```

#### Windows

Ensure Microsoft Visual C++ build tools or Visual Studio Community (with C++ workload) is installed.

## Project Structure

```
.
├── src/                          # Frontend (HTML, CSS, JS)
│   ├── index.html               # Main app UI (minimal - just the pet)
│   └── pet.js                   # Pet behavior state machine and interactions
├── src-tauri/                   # Rust backend
│   ├── src/
│   │   ├── main.rs             # Entry point (minimal)
│   │   └── lib.rs              # Tauri setup, tray menu, window commands
│   ├── Cargo.toml              # Rust dependencies and config
│   └── tauri.conf.json         # Tauri app configuration
├── assets/sprites/             # Canonical sprite source (PNG files)
│   ├── sprite-idle-128.png
│   ├── sprite-idle-blink-128.png
│   └── ... (all 16 sprite states)
├── web/                        # Web preview for Vercel deployment
├── CLAUDE.md                   # Project brief and feature spec
└── .github/workflows/          # CI/CD pipelines
```

## Making Changes

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names following the pattern:
- `feature/` — new functionality
- `fix/` — bug fixes
- `docs/` — documentation updates
- `refactor/` — code refactoring

### Code Changes

#### Frontend (JavaScript)

- Edit `src/pet.js` for pet behavior and state transitions
- Edit `src/index.html` for HTML/CSS structure
- No frameworks — vanilla JavaScript only
- Keep it simple and performance-focused (runs 24/7 in background)

#### Backend (Rust)

- Edit `src-tauri/src/lib.rs` for Tauri commands and tray menu
- Changes to window management, system integration, or commands go here
- Follow Rust naming conventions (snake_case for functions/variables)
- Use `log::info!()` for debug output in development

#### Sprites

- Add or modify PNG sprites in `assets/sprites/`
- Required size: 128x128 pixels with transparent background
- See [Sprite Guidelines](#sprite-guidelines)

## Building and Testing

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

This launches the app in development mode where you can test changes to JavaScript and Rust code. The app window will appear at the bottom of your screen.

### Production Build

Build the application for release:

```bash
npm run build
```

This creates platform-specific installers in `src-tauri/target/release/bundle/`.

### Testing on Different Platforms

- **Linux:** Run on any Linux distribution with GTK 3.x
- **macOS:** Requires macOS 10.13+
- **Windows:** Requires Windows 10+

### Debugging

Check the Tauri logs in development mode:
- Console output appears in the terminal running `npm run dev`
- On Linux: Check system logs with `journalctl -f`

## Sprite Guidelines

All sprites must follow these requirements:

- **Format:** PNG with transparent background (RGBA)
- **Size:** Exactly 128x128 pixels
- **Naming:** `sprite-[state]-128.png`
- **Valid states:** idle, idle-blink, happy, sad, angry, love, cool, surprised, excited, thinking, sleeping, typing, eating, waving, walking, stargazing

### Creating Sprites

1. Design in your preferred tool (Aseprite, Krita, Procreate, Photoshop, etc.)
2. Export as PNG with transparency at 128x128
3. Place in `assets/sprites/`
4. Update `web/sprites/` with a copy for the web preview
5. Reference the sprite in `pet.js` state machine

## Commit Conventions

Follow conventional commits for clear, readable history:

```
type(scope): subject line (max 50 chars)

Optional detailed explanation here. Keep lines under 72 characters
for readability in `git log`. Explain the "why", not the "what".

Issue: #123
```

### Commit Types

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring without behavior change
- `perf:` — performance improvements
- `ci:` — CI/CD pipeline changes
- `chore:` — build, dependencies, tooling

### Examples

```
feat(pet): add stargazing behavior for nighttime

Pets now detect system time and enter stargazing state
between 20:00 and 06:00. Added new sprite state for
consistency with existing behavior machine.

fix(window): defer position to avoid GTK assertion

Early window positioning on Linux caused GTK assertions.
Moved positioning to background thread with 500ms delay.

docs: update contributing guide with sprite requirements
```

## Pull Request Process

1. Push your feature branch to GitHub
2. Create a PR with a clear title and description
3. Ensure the app builds: `npm run build`
4. Link any related issues
5. Request review from maintainers
6. Address feedback and update your PR
7. Maintainers will merge when ready

## Questions?

If you have questions:

1. Check existing issues and PRs
2. Open a new issue with a clear description
3. Use the Discussions section for ideas

Thank you for contributing! 🧊
