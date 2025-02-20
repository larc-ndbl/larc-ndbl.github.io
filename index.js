async function loadCSV(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load ${filePath}: ${response.status}`);
  }
  return await response.text();
}

function parseCSV(csv) {
  const rows = [];
  const lines = csv.split('\n');
  // Headers are in the first line. Not used here. Start from 1 below to skip header.
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let inQuotes = false;
    let currentValue = '';

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Add the last value.

    rows.push(values);
  }
  return rows;
}

async function populateTable() {
  try {

    const csvData = await loadCSV('/booklist.csv');
    const bookData = parseCSV(csvData);
    const tableBody = document.querySelector('tbody');
    bookData.forEach(row => {
      const title = row[2];
      const author = row[3];
      const themes = row[4].split(',').map(theme => theme.trim());
      const description = row[6];
      const isbn = row[7];
      const targetAge = row[9]; // Target Age is now at index 9

      const newRow = tableBody.insertRow();
      const titleCell = newRow.insertCell();
      const authorCell = newRow.insertCell();
      const themesCell = newRow.insertCell();
      const descriptionCell = newRow.insertCell();
      const isbnCell = newRow.insertCell();
      const targetAgeCell = newRow.insertCell();

      titleCell.innerHTML = `<span class="book-title mobile-title">${title}</span>`; // Added mobile-title class
      authorCell.textContent = author;

      const themeList = document.createElement('ul');
      themeList.classList.add('theme-list');
      themes.forEach(theme => {
        const themeItem = document.createElement('li');
        themeItem.textContent = theme;
        themeList.appendChild(themeItem);
      });
      themesCell.appendChild(themeList);

      descriptionCell.innerHTML = `<span class="description">${description}</span>`;

      if (isbn) {
        isbnCell.innerHTML = `<a href="https://isbnsearch.org/isbn/${isbn}" target="_blank">${isbn}</a>`;
      } else {
        isbnCell.textContent = "";
      }

      if (targetAge) {
        const targetAgeList = document.createElement('ul');
        targetAgeList.classList.add('theme-list'); // Reuse the same styling
        const targetAgeItem = document.createElement('li');
        targetAgeItem.textContent = targetAge;
        targetAgeList.appendChild(targetAgeItem);
        targetAgeCell.appendChild(targetAgeList);
      } else {
        targetAgeCell.textContent = "";
      }

      titleCell.classList.add("mobile-title");
      isbnCell.classList.add("mobile-isbn");
      authorCell.classList.add("desktop-only"); // Hide on mobile
      themesCell.classList.add("desktop-only"); // Hide on mobile
      targetAgeCell.classList.add("desktop-only"); // Hide on mobile
      descriptionCell.classList.add("desktop-only"); // Hide on mobile
    });
  } catch (error) {
    console.error("Error populating table:", error);
    document.querySelector('tbody').innerHTML = `<tr><td colspan="6">Error loading book data.</td></tr>`
  }
}

populateTable();
