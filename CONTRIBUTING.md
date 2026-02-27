# Contributing to Chill — Desktop Pet

Thank you for your interest in contributing! This document explains how to set up your development environment and contribute to the project.

## Prerequisites

- **Node.js 22+** — for frontend and Tauri CLI
- **Rust 1.77.2+** — for the Tauri backend
- **Git** — for version control

### System Dependencies

#### macOS
No additional system dependencies required beyond Xcode Command Line Tools.

#### Linux (Ubuntu/Debian)
Install the required libraries for Tauri and GTK:
```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf \
  libgtk-3-dev
```

#### Windows
No additional system dependencies required beyond Visual Studio Build Tools or MinGW.

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chillkimtest-oss/desktop-companion.git
   cd desktop-companion
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Install Rust (if not already installed):**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup default stable
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   This will start the Tauri dev server with hot reload enabled. You should see the desktop pet window appear on your screen.

5. **Build for production:**
   ```bash
   npm run build
   ```
   This creates an optimized, distributable binary for your platform.

## Project Structure

```
desktop-companion/
├── src/                    # Frontend (HTML/CSS/JS)
│   ├── main.html
│   ├── styles.css
│   └── app.js
├── src-tauri/              # Rust backend (Tauri)
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   └── lib.rs         # Core logic
│   ├── tauri.conf.json    # Tauri configuration
│   └── Cargo.toml         # Rust dependencies
├── assets/
│   └── sprites/           # 128x128 PNG sprites
├── web/                   # Web preview (Vercel)
├── package.json           # Node.js dependencies
├── CLAUDE.md              # Project vision & requirements
└── CONTRIBUTING.md        # This file
```

## Architecture Overview

**Chill** is a Tauri v2 application with:
- **Tauri (Rust)** — manages the window, system integration, and tray icon
- **Vanilla HTML/CSS/JS** — renders the sprite and handles animations
- **State Machine** — pet cycles through states: idle, walking, sleeping, typing, thinking, eating, happy, stargazing
- **Click-through Window** — transparent, always-on-top, responsive only to pet pixels

## How to Contribute

### Creating a Feature Branch

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```
   Use descriptive names: `feature/add-custom-pet-names`, `fix/window-drag-issue`, etc.

2. **Make your changes** and test locally:
   ```bash
   npm run dev  # Run dev server to test
   ```

3. **Commit with clear messages:**
   ```bash
   git commit -m "Brief summary of changes"
   ```

4. **Push to your fork and create a PR:**
   ```bash
   git push origin feature/your-feature-name
   ```
   Visit GitHub and open a Pull Request targeting the `main` branch.

### Coding Guidelines

- **Rust code** — Follow Rust conventions; use `cargo fmt` for formatting
- **JavaScript** — Keep it simple and minimal; this is a POC
- **Sprites** — Must be 128x128 PNG with transparent background
- **No external dependencies** — Avoid adding heavy libraries; Tauri + vanilla JS only

### Testing

Currently, the project validates through:
- **Manual testing** — Run `npm run dev` and interact with the pet
- **Cross-platform builds** — GitHub Actions tests on Linux, macOS, and Windows (on release)

### Submitting a Pull Request

1. **Keep PRs focused** — one feature or bug fix per PR
2. **Write a clear description** — explain what and why
3. **Test on your platform** — run `npm run dev` and verify the change works
4. **Link related issues** — if fixing a bug, reference the issue

### Code Review

All PRs require review before merging. Maintainers will:
- Review for code quality and alignment with project goals
- Test on relevant platforms
- Request changes if needed
- Merge once approved

## Running Tests & Checks

### Local validation:
```bash
# Format Rust code
cargo fmt --manifest-path src-tauri/Cargo.toml

# Check Rust code (no build)
cargo check --manifest-path src-tauri/Cargo.toml
```

## Releases

The project uses semantic versioning and GitHub Actions for automated cross-platform builds. Releases are triggered by pushing a tag:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```
GitHub Actions will automatically build and create a release with installers for Linux, macOS, and Windows.

## Questions or Issues?

- Check [CLAUDE.md](./CLAUDE.md) for project vision and requirements
- Open an issue on GitHub for bugs or feature requests
- Feel free to ask questions in PRs — we're here to help!

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
