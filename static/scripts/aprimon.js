// ADD ROW LISTENER
document.addEventListener('DOMContentLoaded', function() {
  const addRowBtn = document.getElementById('add-aprimon-btn');
  const popup = document.getElementById('add-aprimon-popup');
  const addRowForm = document.getElementById('add-row-form');

  addRowBtn.addEventListener('click', function() {
    popup.classList.remove('hidden');
  });

  addRowForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const fieldInput = document.getElementById('add-aprimon-input').value;

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
  });
});