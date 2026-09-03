How to add audio files using Git LFS

This repository is prepared to track MP3 files with Git LFS. Follow the steps below on your machine (or CI runner) to add the audio files and push them to GitHub.

1. Install Git LFS
   - macOS: brew install git-lfs
   - Windows: https://github.com/git-lfs/git-lfs/releases (installer)
   - Linux: use your package manager or visit the website above

2. Enable Git LFS for this repo (run once)
   cd D:\BG
   git lfs install

3. Track MP3s and add files
   git lfs track "File Mp3/*.mp3"
   git add .gitattributes
   git add "File Mp3"/*.mp3

4. Commit and push
   git commit -m "Add audio files via Git LFS"
   git push origin main

Notes and caveats
- GitHub limits storage/bandwidth for Git LFS on free accounts. Consider using S3 or other object storage if you expect heavy traffic.
- Make sure you have permission to publish the audio files.
- If you want me to attempt the push from this machine, authorize me by providing access or run the commands above locally and tell me when done.
