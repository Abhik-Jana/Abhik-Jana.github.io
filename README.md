# Dr. Abhik Jana: academic website (multipage)

Upload everything in this folder to your GitHub Pages repo (replace the old index.html).

## Files
- index.html         Home (about, experience, education, recent publications)
- research.html      Research areas and projects
- publications.html  Searchable, filterable publication list
- teaching.html      Courses
- students.html      Current scholars, completed theses
- service.html       Reviewing, organizing, invited talks, awards
- gallery.html       Photo gallery with enlarge-on-click
- contact.html       Contact details
- assets/style.css   All styling (colours are variables at the top)
- assets/data.js     Publications, thesis lists and gallery photos
- assets/site.js     Top tabs, footer, search and filters

## Common edits
- New publication: add one line to PUBS in assets/data.js. It appears on the Publications page, and the newest five also show on Home.
- New student thesis: add a row to MTECH or BTECH in assets/data.js.
- Add or rename a tab: edit the NAV list at the top of assets/site.js, then copy a page file for the new tab.
- Photo: save it as photo.jpg next to index.html. Résumé: save as cv.pdf.
- Gallery: put images in a gallery/ folder and add lines to GALLERY in assets/data.js.
- Text pages (research, teaching, service): edit the HTML directly. Each dated item is one `<div class="entry">`.

## Visitor counter (one-time setup, about 3 minutes)
1. Sign up free at https://www.goatcounter.com and pick a site code (for example "abhikjana").
2. In GoatCounter go to Settings and tick "Allow adding visitor counts on your website".
3. Open assets/site.js and set `const GOATCOUNTER_CODE = "abhikjana";` (your code).
Push to GitHub. Every page then counts visits (no cookies) and the footer shows the number of visitors.
While the code is empty, no counter is shown and nothing is tracked.

## LinkedIn links for students
Open assets/data.js, find `LINKEDIN`, and paste each student's profile address between the quotes.
A small blue "in" badge then appears next to that name on the Students page. Blank entries show plain names.
Please check with students before linking them.
