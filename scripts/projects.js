document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearBtn = document.getElementById('clear-filters');
    const projects = document.querySelectorAll('.project-card');
    let activeFilters = new Set();

    // 1. Handle Tag Button Clicks
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            if (activeFilters.has(filter)) {
                activeFilters.delete(filter);
                btn.classList.remove('active');
            } else {
                activeFilters.add(filter);
                btn.classList.add('active');
            }

            updateVisibility();
        });
    });

    // 2. Handle Clear Button Click
    clearBtn.addEventListener('click', () => {
        activeFilters.clear();
        filterButtons.forEach(btn => btn.classList.remove('active'));
        updateVisibility();
    });

    function updateVisibility() {
        let visibleTags = new Set();

        // Update Project Cards
        projects.forEach(card => {
            const projectTags = JSON.parse(card.getAttribute('data-tags'));
            
            // Show all if no filters, otherwise check if project has EVERY active tag
            const isVisible = activeFilters.size === 0 || 
                              Array.from(activeFilters).every(f => projectTags.includes(f));

            if (isVisible) {
                card.classList.remove('filtered-out');
                // Collect tags from visible projects to know which buttons to show
                projectTags.forEach(t => visibleTags.add(t));
            } else {
                card.classList.add('filtered-out');
            }
        });

        // Update Tag Buttons visibility (faceted search)
        filterButtons.forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            // Show button if it's currently active OR if it exists in visible projects
            if (activeFilters.size === 0 || visibleTags.has(filter) || activeFilters.has(filter)) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        });

        // Show/Hide the Clear Button
        if (activeFilters.size > 0) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }
});