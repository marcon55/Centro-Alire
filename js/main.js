// Año en el pie
document.getElementById('year').textContent = new Date().getFullYear();

// Cabecera con borde al hacer scroll
const header = document.querySelector('.header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), { passive: true });

// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Animación de aparición
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section__head, .card, .gallery__item, .member, .quote, .post, .steps li, .form, .contact__info')
  .forEach(el => { el.classList.add('reveal'); io.observe(el); });

// Formulario de contacto
// Para recibir los mensajes, crea un formulario gratuito en https://formspree.io
// y pega aquí tu endpoint (p. ej. "https://formspree.io/f/abcdwxyz").
const FORM_ENDPOINT = '';

const form = document.getElementById('contact-form');
const status = form.querySelector('.form__status');

form.addEventListener('submit', async e => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(f => {
    const ok = f.type === 'checkbox' ? f.checked : f.checkValidity() && f.value.trim();
    f.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = 'Revisa los campos marcados y acepta la política de privacidad.';
    status.className = 'form__status error';
    return;
  }

  const data = new FormData(form);

  if (!FORM_ENDPOINT) {
    // Sin endpoint: abre el cliente de correo con el mensaje
    const body = `Nombre: ${data.get('nombre')}\nEmail: ${data.get('email')}\nTeléfono: ${data.get('telefono')}\nServicio: ${data.get('servicio')}\n\n${data.get('mensaje')}`;
    location.href = `mailto:info@centroalire.com?subject=${encodeURIComponent('Consulta web: ' + data.get('servicio'))}&body=${encodeURIComponent(body)}`;
    return;
  }

  status.textContent = 'Enviando…';
  status.className = 'form__status';
  try {
    const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error();
    form.reset();
    status.textContent = '¡Gracias! Te responderemos en menos de 24 horas.';
    status.className = 'form__status ok';
  } catch {
    status.textContent = 'No se pudo enviar. Llámanos o escríbenos por email.';
    status.className = 'form__status error';
  }
});

// Galería: ver foto ampliada
const lightbox = document.querySelector('.lightbox');
const lbImg = lightbox.querySelector('img');
document.querySelectorAll('.gallery__item').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  lbImg.src = a.href;
  lbImg.alt = a.querySelector('img').alt;
  lightbox.hidden = false;
}));
lightbox.addEventListener('click', e => { if (e.target !== lbImg) lightbox.hidden = true; });
addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.hidden = true; });
