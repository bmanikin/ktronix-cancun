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
        submitBtn.style.background = 'linear-gradient(135deg, #FFA048 0%, #FC5701 100%)';
        
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
        toast.style.border = '1.5px solid #FC5701';
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

  // 4. Modales Interactivos y Función Global de Cierre
  const modalOverlays = document.querySelectorAll('.service-modal-overlay');
  const modalTriggers = document.querySelectorAll('[data-modal]');

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 4.1. Navegación fluida y prellenado para enlaces de Cotización hacia #contacto
  const quoteLinks = document.querySelectorAll('a[href="#contacto"]');
  quoteLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Cerrar cualquier modal abierto
      modalOverlays.forEach(m => closeModal(m));
      const projModal = document.getElementById('modal-proyecto-detalle');
      if (projModal) closeModal(projModal);

      // Si el enlace tiene nombre de producto asociado, prellenar el campo de mensaje
      const prodName = link.getAttribute('data-product-name');
      const messageTextarea = document.getElementById('c_mensaje');
      if (messageTextarea && prodName) {
        messageTextarea.value = `Hola, solicito información técnica y cotización para el equipo: ${prodName}.`;
      }

      // Desplazamiento suave con compensación exacta del header fijo
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        const headerOffset = 80;
        const elementPosition = contactSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Foco al campo para facilitar escritura
        setTimeout(() => {
          const firstInput = document.getElementById('c_nombre') || messageTextarea;
          firstInput?.focus();
        }, 600);
      }
    });
  });

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalOverlays.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.service-modal-close')) {
        closeModal(modal);
      }
    });

    const actionLinks = modal.querySelectorAll('.modal-close-and-scroll');
    actionLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeModal(modal);
      });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });

  // 5. Filtro Interactivo de Proyectos
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Modal Interactivo de Ficha Técnica de Proyectos
  const projectsData = {
    aifa: {
      title: "Soluciones Energéticas para el Aeropuerto AIFA",
      category: "Sector Aeroportuario • Misión Crítica",
      status: "Completado",
      statusClass: "completed",
      location: "CDMX / Edo. de México",
      year: "2021 - 2023",
      client: "AIFA / SEDENA",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2025/04/aifa-1200x600.png",
      gallery: [
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/PROYECTO-AIFA-1-rn9ty1dx5gt9pjvqhktgx7704gyxyjx78vhdffy83s.png",
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/PROYECTO-AIFA-2-rn9ty559wsyezzq9vmfz768ui0getcc4le3bcjsnew.png",
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/PROYECTO-AIFA-3-rn9ty70yah0zn7njkn98c5rros758qjl9neab3pv2g.png"
      ],
      paragraphs: [
        "Comprometidos con el crecimiento de la infraestructura en México, desde 2021 hemos trabajado en el suministro de soluciones energéticas para el Aeropuerto Internacional Felipe Ángeles (AIFA), garantizando confiabilidad y respaldo en sus operaciones clave.",
        "Se proporcionaron 21 cargadores para el respaldo de diversas áreas estratégicas del aeropuerto, incluyendo la Terminal de pasajeros, Instalaciones de la autoridad aeroportuaria, Área de catering y estacionamientos subterráneos, Centro de operaciones de aerolíneas, Comedor de empleados y Puestos de acceso.",
        "Además, se suministró una UPS de 30 kVA para la estación de combustible, asegurando la continuidad operativa de este punto crítico de recarga aérea.",
        "Como parte de la continuidad del proyecto, en 2023 se suministraron 3 UPS adicionales para el Depósito de Material Bélico de la Fuerza Aérea (Frente 45), fortaleciendo la infraestructura y máxima seguridad del AIFA.",
        "Orgullosos de contribuir al desarrollo de uno de los aeropuertos más importantes del país, asegurando eficiencia, confiabilidad y seguridad operativa."
      ],
      highlights: [
        { icon: "fas fa-charging-station", label: "21 Cargadores", desc: "Instalados en terminal, catering y accesos" },
        { icon: "fas fa-server", label: "UPS 30 kVA", desc: "Estación de combustible de misión crítica" },
        { icon: "fas fa-shield-alt", label: "3 UPS Frente 45", desc: "Depósito de Material Bélico Fuerza Aérea" },
        { icon: "fas fa-plane-departure", label: "Operatividad 24/7", desc: "Continuidad total en navegación aérea" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20AIFA%20con%20K-tronix."
    },
    tren_maya: {
      title: "Suministro de Cable Ferroviario para el Tren Maya",
      category: "Transporte Ferroviario • Riviera Maya",
      status: "En curso",
      statusClass: "in-progress",
      location: "🌴 Quintana Roo / Sureste",
      year: "2022 - Presente",
      client: "Voltrak / Cunext / SEDENA",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2025/04/tren-maya3.webp",
      gallery: [
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/tren-maya5-rn9u6lozf4jbhnfwha33n1e6yurc39x5r9gmu793ew.jpeg",
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/tren-maya4-rn9u6lozf4jbhnfwha33n1e6yurc39x5r9gmu793ew.jpeg",
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/tren-maya2-rn9u6lozf4jbhnfwha33n1e6yurc39x5r9gmu793ew.jpeg",
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/tren-maya1-rn9u6jtb1ggqufims99ui1v9s30lnvpp305nvnbvrc.jpeg"
      ],
      paragraphs: [
        "En un esfuerzo conjunto con Voltrak y Cunext, participamos en el desarrollo del Tren Maya, uno de los proyectos de infraestructura ferroviaria y turística más importantes en la historia moderna de México.",
        "Para esta obra de envergadura nacional, suministramos cable de contacto de alta pureza y más de 100 bobinas de catenaria, cubriendo un tramo de más de 1,000 km de recorrido en la Riviera Maya y la península.",
        "Este proyecto, entregado a la SEDENA, representa un avance significativo en el fortalecimiento del transporte ferroviario, la electrificación de vías y el desarrollo sustentable de la región sureste.",
        "K-tronix reafirma su compromiso, calidad y tecnología de cobre especializado al servicio del progreso de Quintana Roo y todo el país."
      ],
      highlights: [
        { icon: "fas fa-network-wired", label: "+100 Bobinas", desc: "Catenaria de cobre para tracción eléctrica" },
        { icon: "fas fa-route", label: "+1,000 km", desc: "Cobertura en la Península y Riviera Maya" },
        { icon: "fas fa-handshake", label: "Alianza Estratégica", desc: "Sinergia técnica con Voltrak y Cunext" },
        { icon: "fas fa-train", label: "Transporte Verde", desc: "Infraestructura ferroviaria de alta eficiencia" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20Tren%20Maya%20con%20K-tronix."
    },
    tulum: {
      title: "Aeropuerto Internacional de Tulúm Felipe Carrillo Puerto",
      category: "Sector Aeroportuario • Caribe Mexicano",
      status: "Completado",
      statusClass: "completed",
      location: "🌴 Tulum, Quintana Roo",
      year: "2023 - 2024",
      client: "SEDENA / Aeropuerto Tulum",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2025/04/Aeropuerto-Tulum3-1290x600.jpg",
      gallery: [
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/Aeropuerto-Tulum2-rn9urhnval4php3mib4n1rmy73sz54ufand2rka554.jpg",
        "https://ktronix.com.mx/wp-content/uploads/elementor/thumbs/Aeropuerto-Tulum1-rn9urfs6wx24uh6ctabdws410c28pqmyme23t0cxhk.jpg"
      ],
      paragraphs: [
        "La Subestación Principal de la Planta de Combustibles y Obras Complementarias del Nuevo Aeropuerto Internacional «Felipe Carrillo Puerto» en Tulum, Quintana Roo, requería asegurar una fuente de energía 100% confiable para respaldar sus operaciones críticas y garantizar la continuidad total de los servicios aeroportuarios.",
        "Solución Implementada: Se instalaron tres generadores de luz a diésel de alta potencia: 2 generadores de 800 kW y 1 generador de 1000 kW (totalizando 2,600 kW de respaldo). Cada unidad está equipada con un tanque adicional de diésel de 1,000 litros, diseñada para proporcionar energía inmediata durante cortes de electricidad o contingencias climáticas.",
        "Confiabilidad Energética y Seguridad: La instalación garantizó un suministro ininterrumpido a la planta de combustible para aviones, minimizando a cero el riesgo de interrupciones en el abastecimiento de turbosina.",
        "Eficiencia de Recursos: Al contar con su propio sistema de generación y sincronización automática, se optimizaron los costos operativos y la gestión energética de la terminal."
      ],
      highlights: [
        { icon: "fas fa-bolt", label: "2,600 kW Total", desc: "2 plantas de 800 kW y 1 planta de 1000 kW" },
        { icon: "fas fa-gas-pump", label: "Planta Combustible", desc: "Blindaje energético a tanques de turbosina" },
        { icon: "fas fa-tint", label: "3,000 L Diésel", desc: "Tanques auxiliares de autonomía extendida" },
        { icon: "fas fa-plane", label: "Arranque Automático", desc: "Transferencia instantánea ante cortes de red" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20Aeropuerto%20Tul%C3%BAm%20con%20K-tronix."
    },
    zotv: {
      title: "Z.O.T.V. para la Gerencia Regional de Transmisión Baja California",
      category: "Transmisión Eléctrica • CFE Subestaciones",
      status: "Completado",
      statusClass: "completed",
      location: "Mexicali, Baja California",
      year: "2023",
      client: "Comisión Federal de Electricidad (CFE)",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2025/04/proyecto-zotv.jpg",
      gallery: [],
      paragraphs: [
        "K-tronix colaboró con la Comisión Federal de Electricidad (CFE) para el suministro, instalación, pruebas y puesta en operación de un Sistema de Energía Ininterrumpible de 40 kVA en la Z.O.T.V. (Zona de Operación y Transmisión Valle), en Mexicali, B.C., garantizando la operación continua de los sistemas críticos de control de la red eléctrica regional.",
        "El proyecto incluyó el Commisioning especializado para la correcta alineación y balanceo de sus cargas críticas. El sistema UPS K-tronix cuenta con respaldo de Banco de Baterías de Ácido Plomo VRLA con autonomía de 20 minutos a plena carga.",
        "Con una configuración modular de 2 x 20 kVA (sumados para alcanzar 40 kVA), el sistema ofrece máxima redundancia y confiabilidad. Su topología On-line Doble Conversión elimina puntos comunes de falla, mientras que la tecnología PWM en la fase inversora asegura una onda senoidal pura bajo normas IEC-62040 y VFI-SS-111.",
        "El equipo UPS UPScale fue fabricado en nuestra Planta Matriz en Monterrey, N.L., desde donde se distribuye a todo el país bajo los más estrictos estándares internacionales de calidad."
      ],
      highlights: [
        { icon: "fas fa-server", label: "2 x 20 kVA (40 kVA)", desc: "Topología On-line Doble Conversión" },
        { icon: "fas fa-car-battery", label: "Baterías VRLA", desc: "Respaldo y autonomía de 20 min en Mexicali" },
        { icon: "fas fa-cogs", label: "Norma IEC-62040", desc: "Onda senoidal pura con tecnología PWM" },
        { icon: "fas fa-shield-alt", label: "Commisioning CFE", desc: "Puesta en marcha y alineación de cargas" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20ZOTV%20con%20K-tronix."
    },
    cfe_mederos: {
      title: "CFE Mederos - Departamento Regional de Control",
      category: "Control Eléctrico • Redundancia N+1",
      status: "Completado",
      statusClass: "completed",
      location: "Monterrey, Nuevo León",
      year: "2023",
      client: "CFE Gerencia Regional Noreste",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2025/04/proyecto-cfe-mederos.jpg",
      gallery: [],
      paragraphs: [
        "Suministro, instalación, pruebas y puesta en marcha de un Sistema de Energía Ininterrumpible con Capacidad de 40 kVA en configuración redundante N+1, diseñado específicamente para garantizar la operación ininterrumpida del Departamento Regional de Control de la Gerencia Regional de Transmisión Noreste en la zona Mederos de Monterrey.",
        "K-tronix ejecutó las adecuaciones eléctricas de ingeniería necesarias en el sitio para garantizar la alimentación sin cortes de los sistemas SCADA y control de despacho eléctrico de la zona metropolitana.",
        "La solución cuenta con una arquitectura de 3 x 20 kVA (3 módulos de 20 kVA para lograr 40 kVA N+1 tolerante a fallas), con topología On-line Doble Conversión, modulación PWM e inversión de alta frecuencia.",
        "El sistema incorpora un banco de baterías de ácido-plomo reguladas por válvula (VRLA) con 20 minutos de autonomía, cumpliendo la clasificación internacional VFI-SS-111 y fabricado en nuestra planta matriz de Monterrey."
      ],
      highlights: [
        { icon: "fas fa-cubes", label: "3 x 20 kVA (N+1)", desc: "Arquitectura tolerante a fallas de módulos" },
        { icon: "fas fa-network-wired", label: "Sistemas SCADA", desc: "Protección al centro de control metropolitano" },
        { icon: "fas fa-car-battery", label: "Banco VRLA", desc: "Autonomía de 20 min ante corte general" },
        { icon: "fas fa-industry", label: "Fabricación Nacional", desc: "Orgullo de manufactura en planta Monterrey" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20CFE%20Mederos%20con%20K-tronix."
    },
    larvacore: {
      title: "Criadero de Camarón LarvaCore",
      category: "Industria Acuícola • Continuidad 24/7",
      status: "Completado",
      statusClass: "completed",
      location: "Mazatlán, Sinaloa",
      year: "2023",
      client: "LarvaCore Mazatlán",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2025/04/PROYECTO-LARVACOR.jpg",
      gallery: [],
      paragraphs: [
        "En el sector de la acuicultura, y en particular en los criaderos de larvas de camarón, la continuidad eléctrica es de vida o muerte: una falla en el suministro de oxígeno de pocos minutos destruye lotes completos de reproducción.",
        "K-tronix diseñó e instaló una Planta de Emergencia de 255 kVA con Motor Grupel y Alternador Grupel para respaldar el Tablero de Distribución principal que alimenta las bombas de oxigenación y sistemas de bioseguridad en Mazatlán, Sinaloa.",
        "El equipo está programado para arranque automático instantáneo ante cualquier corte o fluctuación de la red de CFE, garantizando el flujo constante de agua y oxígeno en las piletas de reproducción.",
        "Con esta infraestructura, LarvaCore blindó su inversión biológica, optimizó sus procesos de cría y eliminó los riesgos económicos por inestabilidad eléctrica en zonas costeras."
      ],
      highlights: [
        { icon: "fas fa-bolt", label: "Planta 255 kVA", desc: "Motor y Alternador de alto rendimiento Grupel" },
        { icon: "fas fa-water", label: "Bombas de Oxígeno", desc: "Respaldo continuo a piletas de reproducción" },
        { icon: "fas fa-shield-alt", label: "Cero Pérdida Biológica", desc: "Arranque automático ante fallas de la red" },
        { icon: "fas fa-industry", label: "Resistencia Marina", desc: "Equipos protegidos contra ambiente salino" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20LarvaCore%20con%20K-tronix."
    },
    bancos_bienestar: {
      title: "Bancos del Bienestar - Cobertura Urbana y Rural",
      category: "Sector Financiero & Gobierno • 14 Sitios",
      status: "Completado",
      statusClass: "completed",
      location: "Nuevo León & Cobertura Nacional",
      year: "2023 - 2024",
      client: "SEDENA / Bancos del Bienestar",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2025/04/proyecto-bancos-bienestar.jpg",
      gallery: [],
      paragraphs: [
        "K-tronix colaboró con la SEDENA en el suministro e instalación de Plantas de Emergencia en 14 sucursales del Banco del Bienestar en el Estado de Nuevo León, cubriendo tanto la zona metropolitana como comunidades rurales de difícil acceso.",
        "El proyecto incluyó generadores de 24 kVA marca Grupel con motor y alternador integrados, acompañados de controladores inteligentes DeepSea para monitoreo automático y arranque en falla de red.",
        "La solución garantiza que cajeros automáticos, sistemas de telecomunicaciones, servidores y ventanillas de atención operen sin interrupciones incluso durante contingencias climáticas en zonas apartadas.",
        "Gracias a la alianza estratégica entre K-tronix y Grupel (presente en más de 70 países), se entregó un equipamiento con soporte técnico nacional y máxima confiabilidad."
      ],
      highlights: [
        { icon: "fas fa-landmark", label: "14 Sucursales", desc: "Instalaciones en zonas urbanas y rurales" },
        { icon: "fas fa-bolt", label: "Generadores 24 kVA", desc: "Motor y Alternador Grupel con DeepSea" },
        { icon: "fas fa-globe", label: "Inclusión Social", desc: "Servicio bancario ininterrumpido a usuarios" },
        { icon: "fas fa-tools", label: "Mantenimiento Preventivo", desc: "Cobertura de servicio técnico integral" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20Bancos%20Bienestar%20con%20K-tronix."
    },
    conagua: {
      title: "CONAGUA - Sistema Cutzamala & Cuencas Valle de Bravo",
      category: "Infraestructura Hidráulica • Gobierno Federal",
      status: "Completado",
      statusClass: "completed",
      location: "Valle de Bravo, Edo. de México",
      year: "2022 - 2023",
      client: "Comisión Nacional del Agua (CONAGUA)",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2025/04/proyecto-conagua.jpg",
      gallery: [],
      paragraphs: [
        "El Sistema Cutzamala es la arteria hídrica vital para el almacenamiento, potabilización y distribución de agua potable para millones de habitantes de la Ciudad de México y el Estado de México. K-tronix suministró soluciones integrales de potencia en las Plantas de Bombeo 1, 2, 3, 4, 5 y 6 del sistema de cuencas Valle de Bravo.",
        "Equipamiento Suministrado: Rectificadores industriales de 100 A y 75 A para respaldo del control, instrumentación, telemetría y alumbrado de emergencia, combinados con bancos de Baterías de Níquel-Cadmio de ciclo profundo y alta robustez.",
        "Asimismo, se instalaron sistemas UPS modulares K-tronix (5 sistemas de 10 kVA N+1 y 1 sistema de 20 kVA N+1) dedicados al blindaje de PLC's de control de bombeo y computadoras de mando.",
        "El proyecto abarcó la instalación electromecánica y el comisionamiento en sitio, garantizando que el bombeo de agua más importante del país no se detenga ante disturbios eléctricos."
      ],
      highlights: [
        { icon: "fas fa-tint", label: "6 Plantas de Bombeo", desc: "Protección integral a todo el Sistema Cutzamala" },
        { icon: "fas fa-charging-station", label: "Rectificadores 100/75A", desc: "Con bancos de baterías Níquel-Cadmio" },
        { icon: "fas fa-server", label: "6 Sistemas UPS N+1", desc: "Respaldo a PLC's y telemetría de bombeo" },
        { icon: "fas fa-shield-alt", label: "Misión Nacional", desc: "Suministro continuo de agua potable para CDMX" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20Conagua%20con%20K-tronix."
    },
    magna: {
      title: "MAGNA Electronics - Plantas Guadalupe y Apodaca",
      category: "Industria Automotriz • Manufactura de Alta Precisión",
      status: "Completado",
      statusClass: "completed",
      location: "Guadalupe y Apodaca, Nuevo León",
      year: "2023",
      client: "MAGNA Electronics México",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2024/05/Mask-Group-6-4@2x.jpg",
      gallery: [],
      paragraphs: [
        "Para las plantas de manufactura de componentes electrónicos automotrices de «MAGNA Electronics» en Guadalupe y Apodaca, N.L., K-tronix ejecutó la ingeniería de respaldo, suministro integral e instalación de equipos de potencia de gran escala.",
        "Equipamiento Suministrado: Planta de Emergencia de 941 kVA / 1000 kVA con controlador DeepSea y motorización pesada para respaldo general de planta ante contingencias de red.",
        "Se suministraron Sistemas UPS Online de 400 kVA y 600 kVA para el blindaje de líneas robotizadas de ensamble SMT, previniendo costosos microcortes y variaciones de frecuencia.",
        "Asimismo, se instalaron Supresores de Transientes (TVSS) Nivel C y B en tableros principales y subestaciones, blindando la electrónica de potencia contra descargas atmosféricas y transitorios."
      ],
      highlights: [
        { icon: "fas fa-bolt", label: "Planta 1,000 kVA", desc: "Generador diésel pesado con DeepSea" },
        { icon: "fas fa-server", label: "UPS 600 & 400 kVA", desc: "Protección a líneas SMT robotizadas" },
        { icon: "fas fa-shield-alt", label: "Supresores TVSS B/C", desc: "Protección en tableros y subestación" },
        { icon: "fas fa-car", label: "Calidad Automotriz", desc: "Cero paros en líneas de producción global" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20MAGNA%20con%20K-tronix."
    },
    sedena: {
      title: "SEDENA - Cuarteles Generales Guardia Nacional",
      category: "Seguridad Nacional • Fuerzas Armadas",
      status: "Completado",
      statusClass: "completed",
      location: "Linares y Galeana, Nuevo León",
      year: "2020",
      client: "Secretaría de la Defensa Nacional (SEDENA)",
      mainImg: "https://ktronix.com.mx/wp-content/uploads/2026/05/proyecto-sedena.jpg",
      gallery: [],
      paragraphs: [
        "K-tronix realizó el suministro, instalación, comisionamiento, puesta en marcha y capacitación técnica especializada de 2 Plantas de Emergencia de 24 kW para los Cuarteles Generales de la Guardia Nacional (SEDENA).",
        "Las instalaciones están ubicadas estratégicamente en los municipios de Linares y Galeana, Nuevo León, blindando centros de comando, comunicaciones tácticas y alumbrado perimetral de seguridad.",
        "La solución contempló sistemas de transferencia automática (ATS), pruebas de carga in situ y capacitación operativa al personal militar para su óptimo mantenimiento preventivo.",
        "Con este proyecto, K-tronix reafirma su solvencia técnica y capacidad para cumplir con las rigurosas exigencias de los organismos de seguridad nacional de México."
      ],
      highlights: [
        { icon: "fas fa-shield-alt", label: "2 Plantas 24 kW", desc: "Cuarteles de Linares y Galeana, N.L." },
        { icon: "fas fa-satellite-dish", label: "Comando & C4", desc: "Respaldo a comunicaciones tácticas militares" },
        { icon: "fas fa-graduation-cap", label: "Capacitación Militar", desc: "Entrenamiento operativo in situ al personal" },
        { icon: "fas fa-check-circle", label: "Transferencia ATS", desc: "Conmutación instantánea ante corte de red" }
      ],
      waMessage: "Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20proyecto%20SEDENA%20con%20K-tronix."
    }
  };

  const projectDetailModal = document.getElementById('modal-proyecto-detalle');
  const projectModalContent = document.getElementById('projectModalContent');
  const projectOpenBtns = document.querySelectorAll('.btn-open-project');

  projectOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const proj = projectsData[projId];
      if (!proj || !projectModalContent || !projectDetailModal) return;

      let galleryHtml = '';
      if (proj.gallery && proj.gallery.length > 0) {
        galleryHtml = `
          <div style="margin-top: 1.5rem;">
            <h6 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: var(--color-deep-ocean); margin-bottom: 0.65rem;"><i class="fas fa-camera text-turquoise"></i> Galería de Evidencia en Sitio</h6>
            <div class="project-modal-gallery">
              ${proj.gallery.map(img => `<div class="project-modal-gallery-img"><img src="${img}" alt="${proj.title}" loading="lazy"></div>`).join('')}
            </div>
          </div>
        `;
      }

      let highlightsHtml = '';
      if (proj.highlights && proj.highlights.length > 0) {
        highlightsHtml = `
          <div class="project-highlight-grid">
            ${proj.highlights.map(h => `
              <div class="project-highlight-item">
                <div class="project-highlight-icon"><i class="${h.icon}"></i></div>
                <div class="project-highlight-info">
                  <h6>${h.label}</h6>
                  <p>${h.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      let paragraphsHtml = proj.paragraphs.map(p => `<p>${p}</p>`).join('');

      projectModalContent.innerHTML = `
        <div class="project-modal-header">
          <div class="badge-cancun" style="margin-bottom: 0.5rem;">
            <span>📍</span> ${proj.category}
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.65rem; font-weight: 800; color: var(--color-deep-ocean); line-height: 1.25; margin-bottom: 0.5rem;">
            ${proj.title}
          </h3>
          <div class="project-modal-meta-tags">
            <span class="project-modal-meta-item"><i class="fas fa-map-marker-alt text-coral"></i> <strong>Ubicación:</strong> ${proj.location}</span>
            <span class="project-modal-meta-item"><i class="fas fa-calendar-alt text-turquoise"></i> <strong>Periodo:</strong> ${proj.year}</span>
            <span class="project-modal-meta-item"><i class="fas fa-building text-deep-ocean"></i> <strong>Cliente:</strong> ${proj.client}</span>
            <span class="project-modal-meta-item" style="border-color: ${proj.statusClass === 'completed' ? '#25d366' : 'var(--color-coral)'}; color: ${proj.statusClass === 'completed' ? '#0d9448' : '#e65100'};">
              <i class="fas ${proj.statusClass === 'completed' ? 'fa-check-circle' : 'fa-sync-alt fa-spin'}"></i> <strong>${proj.status}</strong>
            </span>
          </div>
        </div>

        <div class="project-modal-hero-img">
          <img src="${proj.mainImg}" alt="${proj.title}">
        </div>

        ${highlightsHtml}

        <div class="project-modal-body-box">
          <h5 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #0b2e4c; margin: 0 0 0.85rem 0;">
            <i class="fas fa-info-circle text-turquoise"></i> Resumen y Alcance del Proyecto
          </h5>
          <div class="project-modal-body-text">
            ${paragraphsHtml}
          </div>
        </div>

        ${galleryHtml}

        <div class="service-modal-footer">
          <div class="modal-footer-cta">
            <div>
              <h5 style="font-size: 1.05rem; margin-bottom: 0.25rem;">¿Requieres una solución similar para tu empresa?</h5>
              <p style="font-size: 0.85rem; margin: 0;">Nuestros ingenieros especialistas te asesoran en el dimensionamiento y levantamiento en campo.</p>
            </div>
            <div class="modal-footer-cta-actions">
              <a href="https://wa.me/528811058875?text=${proj.waMessage}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-modal">
                <i class="fab fa-whatsapp"></i> WhatsApp Proyecto
              </a>
              <a href="#contacto" class="btn btn-coral modal-close-and-scroll">
                <i class="fas fa-envelope"></i> Cotizar Caso
              </a>
            </div>
          </div>
        </div>
      `;

      projectDetailModal.classList.add('active');
      projectDetailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Re-bind close & scroll buttons in newly inserted content
      const closeLinks = projectModalContent.querySelectorAll('.modal-close-and-scroll');
      closeLinks.forEach(l => {
        l.addEventListener('click', () => {
          closeModal(projectDetailModal);
        });
      });
    });
  });

  // 7. Ruleta / Carrusel de Categorías de Producto
  const productTrack = document.getElementById('productTrack');
  const productPrevBtn = document.getElementById('productPrevBtn');
  const productNextBtn = document.getElementById('productNextBtn');
  const productDots = document.getElementById('productDots');

  if (productTrack) {
    const items = productTrack.querySelectorAll('.product-roulette-item');
    const totalItems = items.length;

    // Generar dots de paginación interactivos
    if (productDots) {
      productDots.innerHTML = '';
      items.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `product-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir a producto ${idx + 1}`);
        dot.addEventListener('click', () => {
          scrollToIndex(idx);
        });
        productDots.appendChild(dot);
      });
    }

    const dots = productDots ? productDots.querySelectorAll('.product-dot') : [];

    const getStepWidth = () => {
      if (!items[0]) return 300;
      if (items.length > 1) {
        const step = items[1].offsetLeft - items[0].offsetLeft;
        if (step > 0) return step;
      }
      return items[0].offsetWidth + 16;
    };

    const updateActiveDot = () => {
      const scrollLeft = productTrack.scrollLeft;
      const step = getStepWidth();
      const activeIdx = Math.round(scrollLeft / step) % totalItems;
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === activeIdx);
      });
    };

    const scrollToIndex = (idx) => {
      const step = getStepWidth();
      productTrack.scrollTo({
        left: idx * step,
        behavior: 'smooth'
      });
    };

    productNextBtn?.addEventListener('click', () => {
      const step = getStepWidth();
      const maxScroll = productTrack.scrollWidth - productTrack.clientWidth;
      if (productTrack.scrollLeft >= maxScroll - 15) {
        productTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        productTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
    });

    productPrevBtn?.addEventListener('click', () => {
      const step = getStepWidth();
      if (productTrack.scrollLeft <= 15) {
        productTrack.scrollTo({ left: productTrack.scrollWidth, behavior: 'smooth' });
      } else {
        productTrack.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });

    productTrack.addEventListener('scroll', updateActiveDot, { passive: true });

    // Click / Touch Flip Card Interaction para Productos
    const productFlipCards = productTrack.querySelectorAll('.product-flip-card');
    productFlipCards.forEach(card => {
      const front = card.querySelector('.product-card-front');
      const closeBtn = card.querySelector('.product-flip-close');
      const actionLinks = card.querySelectorAll('.product-back-actions a');

      front?.addEventListener('click', (e) => {
        // Cerrar otras tarjetas abiertas de productos
        productFlipCards.forEach(c => {
          if (c !== card) c.classList.remove('is-flipped');
        });
        card.classList.toggle('is-flipped');
      });

      closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('is-flipped');
      });

      actionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.stopPropagation(); // Permitir clic directo en WhatsApp o Cotizar
        });
      });
    });

    // Autoplay ruleta de productos
    let autoplayInterval = setInterval(() => {
      // No avanzar automáticamente si el usuario tiene una tarjeta volteada
      const anyFlipped = productTrack.querySelector('.product-flip-card.is-flipped');
      if (anyFlipped) return;

      const step = getStepWidth();
      const maxScroll = productTrack.scrollWidth - productTrack.clientWidth;
      if (productTrack.scrollLeft >= maxScroll - 20) {
        productTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        productTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4500);

    const pauseAutoplay = () => clearInterval(autoplayInterval);
    const resumeAutoplay = () => {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        const anyFlipped = productTrack.querySelector('.product-flip-card.is-flipped');
        if (anyFlipped) return;

        const step = getStepWidth();
        const maxScroll = productTrack.scrollWidth - productTrack.clientWidth;
        if (productTrack.scrollLeft >= maxScroll - 20) {
          productTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          productTrack.scrollBy({ left: step, behavior: 'smooth' });
        }
      }, 4500);
    };

    productTrack.addEventListener('mouseenter', pauseAutoplay);
    productTrack.addEventListener('mouseleave', resumeAutoplay);
    productTrack.addEventListener('touchstart', pauseAutoplay, { passive: true });
    productTrack.addEventListener('touchend', resumeAutoplay, { passive: true });
  }

  // ==========================================
  // RULETA Y FLIP INTERACTIVO DE APLICACIONES
  // ==========================================
  const appTrack = document.getElementById('appTrack');
  const appPrevBtn = document.getElementById('appPrevBtn');
  const appNextBtn = document.getElementById('appNextBtn');
  const appDots = document.getElementById('appDots');

  if (appTrack) {
    const appItems = appTrack.querySelectorAll('.app-roulette-item');
    const totalApps = appItems.length;

    // Generar dots de paginación interactivos
    if (appDots) {
      appDots.innerHTML = '';
      appItems.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `app-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir a aplicación ${idx + 1}`);
        dot.addEventListener('click', () => {
          scrollAppToIndex(idx);
        });
        appDots.appendChild(dot);
      });
    }

    const aDots = appDots ? appDots.querySelectorAll('.app-dot') : [];

    const getAppStepWidth = () => {
      if (!appItems[0]) return 320;
      if (appItems.length > 1) {
        const step = appItems[1].offsetLeft - appItems[0].offsetLeft;
        if (step > 0) return step;
      }
      return appItems[0].offsetWidth + 24;
    };

    const updateActiveAppDot = () => {
      const scrollLeft = appTrack.scrollLeft;
      const step = getAppStepWidth();
      const activeIdx = Math.round(scrollLeft / step) % totalApps;
      aDots.forEach((d, i) => {
        d.classList.toggle('active', i === activeIdx);
      });
    };

    const scrollAppToIndex = (idx) => {
      const step = getAppStepWidth();
      appTrack.scrollTo({
        left: idx * step,
        behavior: 'smooth'
      });
    };

    appNextBtn?.addEventListener('click', () => {
      const step = getAppStepWidth();
      const maxScroll = appTrack.scrollWidth - appTrack.clientWidth;
      if (appTrack.scrollLeft >= maxScroll - 15) {
        appTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        appTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
    });

    appPrevBtn?.addEventListener('click', () => {
      const step = getAppStepWidth();
      if (appTrack.scrollLeft <= 15) {
        appTrack.scrollTo({ left: appTrack.scrollWidth, behavior: 'smooth' });
      } else {
        appTrack.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });

    appTrack.addEventListener('scroll', updateActiveAppDot, { passive: true });

    // Click / Touch Flip Card Interaction
    const flipCards = appTrack.querySelectorAll('.app-flip-card');
    flipCards.forEach(card => {
      const front = card.querySelector('.app-card-front');
      const closeBtn = card.querySelector('.app-flip-close');
      const ctaBtn = card.querySelector('.btn-product-whatsapp');

      front?.addEventListener('click', (e) => {
        // Cerrar otras tarjetas abiertas
        flipCards.forEach(c => {
          if (c !== card) c.classList.remove('is-flipped');
        });
        card.classList.toggle('is-flipped');
      });

      closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('is-flipped');
      });

      ctaBtn?.addEventListener('click', (e) => {
        e.stopPropagation(); // Permitir clic directo en el enlace de WhatsApp
      });
    });

    // Autoplay ruleta de aplicaciones
    let appAutoplay = setInterval(() => {
      // No avanzar automáticamente si el usuario tiene una tarjeta volteada
      const anyFlipped = appTrack.querySelector('.app-flip-card.is-flipped');
      if (anyFlipped) return;

      const step = getAppStepWidth();
      const maxScroll = appTrack.scrollWidth - appTrack.clientWidth;
      if (appTrack.scrollLeft >= maxScroll - 20) {
        appTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        appTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 5000);

    const pauseAppAutoplay = () => clearInterval(appAutoplay);
    const resumeAppAutoplay = () => {
      clearInterval(appAutoplay);
      appAutoplay = setInterval(() => {
        const anyFlipped = appTrack.querySelector('.app-flip-card.is-flipped');
        if (anyFlipped) return;

        const step = getAppStepWidth();
        const maxScroll = appTrack.scrollWidth - appTrack.clientWidth;
        if (appTrack.scrollLeft >= maxScroll - 20) {
          appTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          appTrack.scrollBy({ left: step, behavior: 'smooth' });
        }
      }, 5000);
    };

    appTrack.addEventListener('mouseenter', pauseAppAutoplay);
    appTrack.addEventListener('mouseleave', resumeAppAutoplay);
    appTrack.addEventListener('touchstart', pauseAppAutoplay, { passive: true });
    appTrack.addEventListener('touchend', resumeAppAutoplay, { passive: true });
  }
  // ==========================================================================
  // COTIZADOR INTERACTIVO DE PLANTAS DE EMERGENCIA (ATS & VOLTAJE)
  // ==========================================================================
  const modalPlanta = document.getElementById('modal-cotizar-planta');
  const closePlantaBtn = document.getElementById('closePlantaModal');
  const openPlantaBtns = document.querySelectorAll('.open-plantas-cfg');
  const cfgCapacidad = document.getElementById('cfg_capacidad');
  const cfgVoltCustom = document.getElementById('cfg_volt_custom');
  const cfgPriceDisplay = document.getElementById('cfg_price_display');
  const cfgStockBadge = document.getElementById('cfg_stock_badge');
  const btnSendWhatsapp = document.getElementById('btnSendWhatsappQuote');
  const btnSendForm = document.getElementById('btnSendFormQuote');

  const updatePlantaCalculation = () => {
    if (!cfgCapacidad || !modalPlanta) return;
    
    const selectedOption = cfgCapacidad.options[cfgCapacidad.selectedIndex];
    const isATS = document.querySelector('input[name="cfg_ats"]:checked')?.value.includes('Con ATS');
    const price = isATS ? parseFloat(selectedOption.getAttribute('data-ats')) : parseFloat(selectedOption.getAttribute('data-sin'));
    const stockInfo = selectedOption.getAttribute('data-stock');

    if (cfgPriceDisplay) {
      cfgPriceDisplay.textContent = '$' + price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    if (cfgStockBadge) {
      if (stockInfo.includes('Stock')) {
        cfgStockBadge.className = 'stock-badge-pill in-stock';
        cfgStockBadge.innerHTML = '<i class="fas fa-check-circle"></i> ' + stockInfo;
      } else {
        cfgStockBadge.className = 'stock-badge-pill transit';
        cfgStockBadge.innerHTML = '<i class="fas fa-shipping-fast"></i> ' + stockInfo;
      }
    }
  };

  // Mostrar / Ocultar campo de voltaje personalizado
  document.querySelectorAll('input[name="cfg_volt"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (cfgVoltCustom) {
        cfgVoltCustom.style.display = radio.value === 'Otro voltaje específico' ? 'block' : 'none';
        if (radio.value === 'Otro voltaje específico') cfgVoltCustom.focus();
      }
    });
  });

  // Listeners para cambio de capacidad o ATS
  cfgCapacidad?.addEventListener('change', updatePlantaCalculation);
  document.querySelectorAll('input[name="cfg_ats"]').forEach(radio => {
    radio.addEventListener('change', updatePlantaCalculation);
  });

  // Abrir modal configurador
  openPlantaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const kw = btn.getAttribute('data-kw');
      if (kw && cfgCapacidad) {
        for (let i = 0; i < cfgCapacidad.options.length; i++) {
          if (cfgCapacidad.options[i].value === kw) {
            cfgCapacidad.selectedIndex = i;
            break;
          }
        }
      }
      updatePlantaCalculation();
      if (modalPlanta) {
        modalPlanta.classList.add('active');
        modalPlanta.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Cerrar modal
  const closePlantaModal = () => {
    if (modalPlanta) {
      modalPlanta.classList.remove('active');
      modalPlanta.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  closePlantaBtn?.addEventListener('click', closePlantaModal);
  modalPlanta?.addEventListener('click', (e) => {
    if (e.target === modalPlanta) closePlantaModal();
  });

  // Enviar por WhatsApp con mensaje estructurado completo
  btnSendWhatsapp?.addEventListener('click', () => {
    const selectedOption = cfgCapacidad.options[cfgCapacidad.selectedIndex];
    const kw = selectedOption.value + ' kW';
    const model = selectedOption.getAttribute('data-model');
    const atsMode = document.querySelector('input[name="cfg_ats"]:checked')?.value || 'Con ATS (Automático)';
    
    let voltMode = document.querySelector('input[name="cfg_volt"]:checked')?.value || '220 VCA';
    if (voltMode === 'Otro voltaje específico' && cfgVoltCustom?.value.trim()) {
      voltMode = 'Personalizado: ' + cfgVoltCustom.value.trim();
    }

    const priceText = cfgPriceDisplay?.textContent || '$0.00';
    const ciudad = document.getElementById('cfg_ciudad')?.value.trim() || 'No especificada';

    const message = `Hola K-tronix Cancún, deseo solicitar la cotización formal de una Planta de Emergencia Grupel:

• Capacidad: ${kw}
• Modelo: ${model}
• Modalidad: ${atsMode}
• Voltaje Requerido: ${voltMode}
• Precio de Lista Referencial: ${priceText} MXN + IVA
• Destino / Ciudad: ${ciudad}

Por favor confirmar disponibilidad en stock, costos de envío y tiempo de entrega.`;

    const whatsappUrl = `https://wa.me/528811058875?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closePlantaModal();
  });

  // Enviar a Formulario de Contacto en la misma página
  btnSendForm?.addEventListener('click', () => {
    const selectedOption = cfgCapacidad.options[cfgCapacidad.selectedIndex];
    const kw = selectedOption.value + ' kW';
    const model = selectedOption.getAttribute('data-model');
    const atsMode = document.querySelector('input[name="cfg_ats"]:checked')?.value || 'Con ATS';
    
    let voltMode = document.querySelector('input[name="cfg_volt"]:checked')?.value || '220 VCA';
    if (voltMode === 'Otro voltaje específico' && cfgVoltCustom?.value.trim()) {
      voltMode = cfgVoltCustom.value.trim();
    }

    const priceText = cfgPriceDisplay?.textContent || '';
    const ciudad = document.getElementById('cfg_ciudad')?.value.trim() || '';

    const messageField = document.getElementById('c_mensaje');
    if (messageField) {
      messageField.value = `Hola, solicito cotización formal de Planta de Emergencia Grupel de ${kw} (Modelo ${model}), en modalidad ${atsMode}, con requerimiento de Voltaje: ${voltMode}.${ciudad ? ' Destino: ' + ciudad + '.' : ''} (Precio ref: ${priceText} MXN).`;
    }

    closePlantaModal();

    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      const headerOffset = 90;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  });

  // ==========================================================================
  // CONFIGURACIÓN DIRECTA EN FILAS DE LA TABLA (ATS, VOLTAJE Y PRECIO)
  // ==========================================================================
  const generatorRows = document.querySelectorAll('.generator-row');

  generatorRows.forEach(row => {
    const atsSelect = row.querySelector('.row-ats-select');
    const voltSelect = row.querySelector('.row-volt-select');
    const priceVal = row.querySelector('.row-price-val');
    const cotizarBtn = row.querySelector('.btn-stock-cotizar-direct');

    const atsPrice = parseFloat(row.getAttribute('data-ats-price'));
    const sinPrice = parseFloat(row.getAttribute('data-sin-price'));
    const kw = row.getAttribute('data-kw');
    const model = row.getAttribute('data-model');
    const stock = row.getAttribute('data-stock');

    // Actualizar precio en vivo al cambiar el selector de ATS en la fila
    atsSelect?.addEventListener('change', () => {
      const isATS = atsSelect.value === 'con';
      const currentPrice = isATS ? atsPrice : sinPrice;
      if (priceVal) {
        priceVal.textContent = '$' + currentPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    });

    // Enviar cotización por WhatsApp con la configuración exacta de esa fila
    cotizarBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      
      const isATS = atsSelect.value === 'con';
      const atsText = isATS ? 'Con ATS (Transferencia Automática)' : 'Sin ATS (Transferencia Manual)';
      const currentPrice = isATS ? atsPrice : sinPrice;
      const priceFormatted = '$' + currentPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN + IVA';

      let voltValue = voltSelect.value;
      if (voltValue.includes('Otro')) {
        const customPrompt = prompt('Por favor, especifique el voltaje requerido para su planta de ' + kw + ' kW:', '440 VCA');
        if (customPrompt && customPrompt.trim()) {
          voltValue = 'Personalizado: ' + customPrompt.trim();
        } else {
          voltValue = '220 VCA (A definir)';
        }
      }

      const message = `Hola K-tronix Cancún, deseo solicitar la cotización formal de una Planta de Emergencia Grupel:

• Capacidad: ${kw} kW (Stand by)
• Modelo: ${model}
• Modalidad: ${atsText}
• Voltaje Requerido: ${voltValue}
• Precio de Lista Referencial: ${priceFormatted}
• Disponibilidad: ${stock}

Por favor confirmar existencias, tiempos de entrega y costos de flete.`;

      const whatsappUrl = `https://wa.me/528811058875?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  });

});