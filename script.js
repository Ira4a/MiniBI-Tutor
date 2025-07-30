let parsedData = [];
let chart = null;

const csvInput = document.getElementById("csvFile");
const xSelect = document.getElementById("xColumn");
const ySelect = document.getElementById("yColumn");
const chartCanvas = document.getElementById("chartCanvas");

csvInput.addEventListener("change", function () {
  const file = csvInput.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      parsedData = results.data.filter(row => Object.values(row).some(v => v !== null && v !== ""));
      populateDropdowns();
      renderTable();
    }
  });
});

function populateDropdowns() {
  const keys = Object.keys(parsedData[0]);
  xSelect.innerHTML = "";
  ySelect.innerHTML = "";
  keys.forEach(key => {
    const optionX = document.createElement("option");
    const optionY = document.createElement("option");
    optionX.value = optionY.value = key;
    optionX.text = optionY.text = key;
    xSelect.appendChild(optionX);
    ySelect.appendChild(optionY);
  });
}

function renderTable() {
  const tableDiv = document.getElementById("dataPreview");
  const keys = Object.keys(parsedData[0]);
  let html = "<table><thead><tr>";
  keys.forEach(k => html += `<th>${k}</th>`);
  html += "</tr></thead><tbody>";
  parsedData.forEach(row => {
    html += "<tr>";
    keys.forEach(k => html += `<td>${row[k]}</td>`);
    html += "</tr>";
  });
  html += "</tbody></table>";
  tableDiv.innerHTML = html;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  if (parsedData.length === 0) {
    alert("Сначала загрузите CSV-файл");
    return;
  }

  const xKey = xSelect.value;
  const yKey = ySelect.value;
  const chartType = document.getElementById("chartType").value;

  const labels = parsedData.map(row => row[xKey]);
  const values = parsedData.map(row => row[yKey]);

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: chartType,
    data: {
      labels: labels,
      datasets: [{
        label: `${yKey} по ${xKey}`,
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.5)"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: chartType !== "bar"
        }
      }
    }
  });
});

document.getElementById("saveBtn").addEventListener("click", () => {
  if (!chart) return;
  const link = document.createElement("a");
  link.download = "chart.png";
  link.href = chart.toBase64Image();
  link.click();
});
