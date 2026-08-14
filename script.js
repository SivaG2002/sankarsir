const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');

  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute(
    'aria-label',
    isOpen ? 'Close navigation' : 'Open navigation'
  );
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');

    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  });
});

const enquiryForm = document.querySelector('#consultation-form');
const formStatus = document.querySelector('.form-status');

enquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = new FormData(enquiryForm)
    .get('name')
    ?.toString()
    .trim();

  if (formStatus) {
    formStatus.textContent =
      `Thank you${name ? `, ${name}` : ''}. Your enquiry details are ready to be sent.`;
  }

  enquiryForm.reset();
});


/* =========================
   VISITOR COUNTER
   ========================= */

async function updateVisitorCount() {
  try {
    const response = await fetch('/api/visits', {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Visitor API failed');
    }

    const data = await response.json();

    console.log('Total visitors:', data.count);

    // If your HTML has an element with id="visitor-count",
    // it will display the number automatically.
    const visitorCount = document.querySelector('#visitor-count');

    if (visitorCount) {
      visitorCount.textContent = data.count.toLocaleString();
    }

  } catch (error) {
    console.error('Could not update visitor count:', error);
  }
}

updateVisitorCount();