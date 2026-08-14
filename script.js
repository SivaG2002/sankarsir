const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
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
  const name = new FormData(enquiryForm).get('name')?.toString().trim();
  formStatus.textContent = `Thank you${name ? `, ${name}` : ''}. Your enquiry details are ready to be sent.`;
  enquiryForm.reset();
});
