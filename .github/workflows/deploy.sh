set -e

echo "Starting deployment to production server..."

REMOTE_USER=$REMOTE_USER
REMOTE_HOST=$REMOTE_HOST
REMOTE_PATH=/var/www/cv_js_propre

echo "📦 Sending files to the VPS..."
rsync -avz --delete \
  --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='.gitignore' \
  --exclude='CLAUDE.md' \
  --exclude='README.md' \
  --exclude='pdf' \
  --exclude='data/projects.json' \
  ./ \
  $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

echo "✅ Deployment to production server completed successfully."
