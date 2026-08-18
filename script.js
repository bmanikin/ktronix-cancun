/**
 * KTronix - Tema Cancún Interactive Script
 * Control de menú móvil, formulario de contacto, botón de retorno y animaciones.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú Móvil (Toggle y Drawer)
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileItems = document.querySelectorAll('.mobile-nav-item');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });

    mobileItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Botón Volver Arriba
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. Formulario de Contacto (Contáctanos)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando tu mensaje...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje Enviado con Éxito!';
        submitBtn.style.background = 'linear-gradient(135deg, #00C9A7 0%, #00B4DB 100%)';
        
        // Notificación flotante estilo Cancún
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '95px';
        toast.style.right = '25px';
        toast.style.background = '#08253E';
        toast.style.color = '#ffffff';
        toast.style.padding = '1.1rem 1.6rem';
        toast.style.borderRadius = '12px';
        toast.style.boxShadow = '0 12px 30px rgba(0, 180, 219, 0.45)';
        toast.style.border = '1.5px solid #00B4DB';
        toast.style.zIndex = '10000';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '0.75rem';
        toast.style.fontSize = '0.95rem';
        toast.innerHTML = '🌴 <strong>¡Gracias por contactar a K-tronix!</strong> Un especialista se comunicará contigo a la brevedad.';
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.5s ease';
          setTimeout(() => toast.remove(), 500);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          contactForm.reset();
        }, 4000);
      }, 1000);
    });
  }
});
