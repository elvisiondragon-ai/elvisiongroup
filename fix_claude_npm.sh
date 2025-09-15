#!/bin/bash

# Fix Claude Code npm auto-update issues
# This script fixes npm permissions and reinstalls Claude Code

echo "🔧 Fixing Claude Code npm auto-update issues..."

# Create npm global directory in user home
echo "📁 Creating ~/.npm-global directory..."
mkdir -p ~/.npm-global

# Set npm to use the new directory
echo "⚙️ Setting npm prefix to ~/.npm-global..."
npm config set prefix '~/.npm-global'

# Add to PATH for current session
echo "📍 Adding to PATH for current session..."
export PATH=~/.npm-global/bin:$PATH

# Make PATH change permanent
echo "💾 Making PATH change permanent..."
if [[ "$SHELL" == *"zsh"* ]]; then
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
    echo "✅ Added to ~/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bash_profile
    echo "✅ Added to ~/.bash_profile"
fi

# Fix npm cache permissions first (if needed)
echo "🔧 Checking npm cache permissions..."
if [ -d "/Users/$(whoami)/.npm" ]; then
    sudo chown -R $(id -u):$(id -g) "/Users/$(whoami)/.npm" 2>/dev/null || echo "⚠️ Could not fix cache permissions (not critical)"
fi

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force 2>/dev/null || echo "⚠️ Cache clean had warnings (not critical)"

# Uninstall old Claude Code (if exists)
echo "🗑️ Removing old Claude Code installation..."
npm uninstall -g @anthropic-ai/claude-code 2>/dev/null || true

# Reinstall Claude Code
echo "⬇️ Installing Claude Code..."
npm install -g @anthropic-ai/claude-code@latest

# Verify installation
echo "✅ Verifying installation..."
echo "📍 npm prefix: $(npm config get prefix)"
echo "🎯 Claude location: $(which claude 2>/dev/null || echo 'Not found in current PATH')"

echo ""
echo "🎉 Setup complete!"
echo "🔄 Please restart your terminal or run: source ~/.zshrc"
echo "🧪 Test with: claude --version"
echo ""
echo "💡 Pro tips:"
echo "   • Run 'claude doctor' if you get update issues"
echo "   • Use 'claude-update' alias for manual updates"
echo "   • Auto-updates should now work without permission issues"

# Add useful alias
echo "📝 Adding claude-update alias..."
if [[ "$SHELL" == *"zsh"* ]]; then
    echo 'alias claude-update="npm install -g @anthropic-ai/claude-code@latest"' >> ~/.zshrc
elif [[ "$SHELL" == *"bash"* ]]; then
    echo 'alias claude-update="npm install -g @anthropic-ai/claude-code@latest"' >> ~/.bash_profile
fi
echo "✅ Added claude-update alias (restart terminal to use)"