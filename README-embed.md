How to embed MP3 files into the page as data URIs

You chose to embed all MP3 files directly into the HTML/JS as data URIs. Embedding converts the binary MP3 files into base64 text and replaces the filenames in app.js with long data:audio/mpeg;base64,... strings.

Steps:
1. Make sure Node.js is installed on your machine.
2. Open a terminal and change directory to this project folder (D:\BG):
   cd D:\BG
3. Run the embedding script:
   node embed_audio.js

What the script does:
- Scans app.js for entries like track: 'Something.mp3'
- Reads the referenced MP3 files from `File Mp3`, converts them to base64, and writes a new file called app.embedded.js where the track fields are replaced by data URIs.

After the script completes:
- Option A (quick): In index.html replace the <script src="app.js"></script> line with <script src="app.embedded.js"></script>
- Option B (overwrite): Rename app.embedded.js to app.js (backup original first) so the page loads the embedded version by default.

Important notes / caveats:
- The embedded JS file can become huge (many MBs). Serving such a large file may be slow and will increase memory usage in the browser.
- Editing embedded audio requires re-running the script.
- Because the embedded script is very large, browsers may reject it when index.html is opened directly with `file://`. Use a local HTTP server instead:
  `cd D:\BG` then `python -m http.server 8000`
  Open `http://127.0.0.1:8000/index.html`.

If you want, I can update index.html now to load app.embedded.js (but the script must be run first to generate that file).