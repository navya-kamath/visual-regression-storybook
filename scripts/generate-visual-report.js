const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();

const resultsPath = path.join(rootDir, "playwright-report", "results.json");
const outputPath = path.join(rootDir, "playwright-report", "visual-report.html");

if (!fs.existsSync(resultsPath)) {
  console.error("❌ results.json not found");
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));

let total = 0;
let passed = 0;
let failedStories = [];

function parseSuites(suites) {
  suites.forEach((suite) => {

    if (suite.specs) {
      suite.specs.forEach((spec) => {

        spec.tests.forEach((test) => {
          total++;

          const result = test.results[0];
          const status = result.status;

          if (status === "passed") {
            passed++;
          } else {

            let baseline = null;
            let actual = null;
            let diff = null;

            (result.attachments || []).forEach((att) => {
              if (att.name?.includes("expected")) baseline = att.path;
              if (att.name?.includes("actual")) actual = att.path;
              if (att.name?.includes("diff")) diff = att.path;
            });

            failedStories.push({
              name: spec.title,
              baseline,
              actual,
              diff
            });

          }
        });

      });
    }

    if (suite.suites) parseSuites(suite.suites);

  });
}

parseSuites(results.suites);

const coverage = total === 0 ? 0 : ((passed / total) * 100).toFixed(1);

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Visual Regression Coverage</title>

<style>
body {
  background:#0f172a;
  color:white;
  font-family:Arial;
  padding:20px;
}

.card {
  background:#1e293b;
  padding:20px;
  border-radius:12px;
  margin-bottom:20px;
}

.coverage {
  font-size:55px;
  font-weight:bold;
  color:#38bdf8;
}

.story-toggle {
  background:#334155;
  padding:12px;
  margin-top:10px;
  cursor:pointer;
  border-radius:6px;
}

.images {
  display:flex;
  gap:20px;
  margin-top:15px;
}

.images div {
  text-align:center;
}

img {
  max-width:300px;
  border-radius:8px;
  border:2px solid #475569;
}

.hidden {
  display:none;
}
</style>

<script>
function toggle(id){
  document.getElementById(id).classList.toggle("hidden");
}
</script>

</head>

<body>

<div class="card">
  <h1>Visual Regression Coverage</h1>
  <div class="coverage">${coverage}%</div>

  <p>Total Stories: ${total}</p>
  <p>Passed: ${passed}</p>
  <p>Failed: ${failedStories.length}</p>

  <p>
    <a href="index.html" style="color:#38bdf8;">
      Open Playwright Full Report
    </a>
  </p>
</div>

${failedStories.map((story, i) => `
<div class="card">

  <div class="story-toggle" onclick="toggle('story-${i}')">
    ❌ ${story.name}
  </div>

  <div id="story-${i}" class="hidden">

    <div class="images">

      ${
        story.baseline
          ? `<div>
              <p>Baseline</p>
              <img src="../${story.baseline}" />
            </div>`
          : ""
      }

      ${
        story.actual
          ? `<div>
              <p>${story.baseline ? "Actual" : "Reference"}</p>
              <img src="../${story.actual}" />
            </div>`
          : ""
      }

      ${
        story.diff
          ? `<div>
              <p>Diff</p>
              <img src="../${story.diff}" />
            </div>`
          : ""
      }

    </div>

  </div>

</div>
`).join("")}

</body>
</html>
`;

fs.writeFileSync(outputPath, html);

console.log("✅ Visual regression HTML report generated!");
