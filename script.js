let parsedData = [];
let chart;

function renderTable(data) {
  const keys = Object.keys(data[0]);
  let html = '<table><thead><tr>';
  keys.forEach(k => html += `<th>${k}</th>`);
  html += '</tr></thead><tbody>';
  data.forEach(row => {
    html += '<tr>';
    keys.forEach(k => html += `<td>${row[k]}</td>`);
    html += '</tr>';
  });
  html += '</tbody></table>';
  document.getElementById('dataPreview').innerHTML = html;
}

function updateColumnSelectors(data) {
  const keys = Object.keys(data[0]);
  const xSelect = document.getElementById('xColumn');
  const ySelect = document.getElementById('yColumn');
  xSelect.innerHTML = '';
  ySelect.innerHTML = '';
  keys.forEach(k => {
    xSelect.innerHTML += `<option value="${k}">${k}</option>`;
    ySelect.innerHTML += `<option value="${k}">${k}</option>`;
  });
}

document.getElementById('csvFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        parsedData = results.data.filter(row =>
          Object.values(row).some(v => v !== null && v !== '')
        );
        if (parsedData.length > 0) {
          alert("CSV успешно загружен!");
          renderTable(parsedData);
          updateColumnSelectors(parsedData);
        } else {
          alert("Файл пуст или некорректен.");
        }
      }
    });
  }
});

document.getElementById('generateBtn').addEventListener('click', function() {
  if (!parsedData.length) {
    alert("Сначала загрузите CSV.");
    return;
  }

  const xKey = document.getElementById('xColumn').value;
  const yKey = document.getElementById('yColumn').value;
  const chartType = document.getElementById('chartType').value;

  const labels = parsedData.map(r => r[xKey]);
  const values = parsedData.map(r => r[yKey]);

  if (chart) chart.destroy();
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: [{
        label: `${yKey} по ${xKey}`,
        data: values,
        backgroundColor: 'rgba(54,162,235,0.6)',
        borderColor: 'rgba(54,162,235,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: true }
      }
    }
  });

  // 🎯 Проверка задания
  const taskText = document.getElementById('taskStatus');
  if (xKey === "Месяц" && yKey === "Продажи" && chartType === "bar") {
    taskText.innerText = "✅ Задание выполнено правильно!";
    taskText.style.color = "green";
  } else {
    taskText.innerText = "❌ Задание ещё не выполнено.";
    taskText.style.color = "red";
  }
});

// Сохранить диаграмму
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!chart) {
    alert("Сначала постройте диаграмму.");
    return;
  }
  const link = document.createElement('a');
  link.download = 'chart.png';
  link.href = chart.toBase64Image();
  link.click();
});
