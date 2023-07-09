// ADD ROW LISTENER
document.addEventListener('DOMContentLoaded', function() {

  const addRowBtn = document.getElementById('add-aprimon-btn');
  const popup = document.getElementById('add-aprimon-popup');
  const addRowForm = document.getElementById('add-row-form');

  const fieldInput = document.getElementById('add-aprimon-input');

  // Show form.
  addRowBtn.addEventListener('click', function() {
    popup.classList.remove('hidden');
  });

  fieldInput.addEventListener('input', searchName);

  function searchName() {
    const enteredName = fieldInput.value;
    const dropdown = document.getElementById('result-dropdown');
    dropdown.innerHTML = '';

    fetch('/search_pokemon', {
      method: 'POST',
      body: JSON.stringify({ name: enteredName }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        data.results.forEach(result => {
          const option = document.createElement('option');
          option.value = result.id;
          option.text = result.name;
          dropdown.appendChild(option);
        });
        dropdown.style.display = 'block';

      } else if (data.status === 'not_found') {
        dropdown.innerHTML = 'Test'
        // Nothing found, show nothing found message.
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  // Submission.
  addRowForm.addEventListener('submit', function(event) {
    event.preventDefault();

    fetch('/add_aprimon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: fieldInput }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        location.reload()
      } else {
        alert('Failed to add a new row.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  })
});