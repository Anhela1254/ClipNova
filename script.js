/* WhatsApp oficial de ClipNova Digital Shop (+58 412-3570826). */
const WHATSAPP_NUMBER = "584123570826";

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu-principal');

function closeMenu() {
  menu.classList.remove('is-open');
  menuButton.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
}

menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('is-open');
  menuButton.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

document.querySelectorAll('#menu-principal a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

const contactForm = document.querySelector('#consultation-form');
const categorySelect = document.querySelector('#categoria');
const messageField = document.querySelector('#mensaje');
const nameField = document.querySelector('#nombre');
const dialog = document.querySelector('#message-dialog');
const messagePreview = document.querySelector('#message-preview');
const copyStatus = document.querySelector('#copy-status');
const status = document.querySelector('#form-status');

// Botones de cada categoría: seleccionan la categoría correcta y llevan al formulario.
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    categorySelect.value = button.dataset.service;
    if (!messageField.value.trim()) {
      messageField.value = `Hola, quisiera conocer los productos disponibles en ${button.dataset.service}, sus precios y condiciones.`;
    }
    document.querySelector('#contacto').scrollIntoView({ behavior: 'smooth' });
    status.hidden = true;
  });
});

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const name = nameField.value.trim();
  const category = categorySelect.value.trim();
  const inquiry = messageField.value.trim();
  if (!inquiry) { messageField.focus(); return; }

  const message = [
    'Hola, ClipNova. Me gustaría recibir información.',
    name ? `Mi nombre es: ${name}` : '',
    `Categoría: ${category}`,
    `Consulta: ${inquiry}`,
    '¿Podrían confirmarme disponibilidad, precio y condiciones?'
  ].filter(Boolean).join('\n');

  const number = WHATSAPP_NUMBER.replace(/\D/g, '');
  if (number.length >= 10 && number.length <= 15) {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    status.textContent = 'Se abrió WhatsApp con tu consulta. Revisa el mensaje antes de enviarlo.';
    status.hidden = false;
    return;
  }

  messagePreview.value = message;
  copyStatus.textContent = '';
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    messagePreview.focus();
    status.textContent = 'Copia el mensaje mostrado para enviarlo por tu canal de contacto.';
    status.hidden = false;
  }
});

document.querySelector('#copy-message').addEventListener('click', async () => {
  const message = messagePreview.value;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(message);
    } else {
      messagePreview.select();
      const copied = document.execCommand('copy');
      if (!copied) throw new Error('Copiado no disponible');
    }
    copyStatus.textContent = '¡Mensaje copiado! Ya puedes pegarlo en tu WhatsApp.';
  } catch {
    copyStatus.textContent = 'Selecciona el texto del recuadro y cópialo manualmente.';
    messagePreview.focus();
    messagePreview.select();
  }
});

dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('#year').textContent = new Date().getFullYear();
