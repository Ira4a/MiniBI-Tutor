let parsedData = [];
    let chart;

    // Отображение таблицы данных
    function renderTable(data) {
      const keys = Object.keys(data[0]);
      let html = '<table><thead><tr>';
      keys.forEach(key => html += `<th>${key}</th>`);
      html += '</tr></thead><tbody>';
      data.forEach(row => {
        html += '<tr>';
        keys.forEach(key => html += `<td>${row[key]}</td>`);
        html += '</tr>';
      });
      html += '</tbody></table>';
      document.getElementById('dataPreview').innerHTML = html;
    }

    // Загрузка CSV-файла
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
              alert("CSV загружен. Строк: " + parsedData.length);
              renderTable(parsedData);
            } else {
              alert("Файл пуст или некорректен.");
            }
          }
        });
      }
    });

    // Построение графика
    document.getElementById('generateBtn').addEventListener('click', function() {
      if (!parsedData || parsedData.length === 0) {
        alert("Сначала загрузите CSV-файл!");
        return;
      }

      const keys = Object.keys(parsedData[0]);
      if (keys.length < 2) {
        alert("Нужно минимум 2 колонки в CSV.");
        return;
      }

      const labels = parsedData.map(row => row[keys[0]]);
      const values = parsedData.map(row => row[keys[1]]);

      const ctx = document.getElementById('chartCanvas').getContext('2d');
      if (chart) chart.destroy();

      const chartType = document.getElementById('chartType').value;

      chart = new Chart(ctx, {
        type: chartType,
        data: {
          labels: labels,
          datasets: [{
            label: `${keys[1]} по ${keys[0]}`,
            data: values,
            backgroundColor: [
              'rgba(75,192,192,0.5)',
              'rgba(255,99,132,0.5)',
              'rgba(255,206,86,0.5)',
              'rgba(54,162,235,0.5)',
              'rgba(153,102,255,0.5)',
              'rgba(255,159,64,0.5)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          }
        }
      });
    });
