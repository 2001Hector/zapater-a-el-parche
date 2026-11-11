/**
 * ZAPATERÍA EL PARCHE - SCRIPT INTERACTIVO (JAVASCRIPT PURO)
 * Compatible con cualquier servidor o repositorio Git estático
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Año actual en el footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Menú móvil
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Calculador de Horario en tiempo real
  function checkStoreStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTimeVal = hour + minute / 60;

    const liveStatusTitle = document.getElementById('liveStatusTitle');
    const liveStatusDetail = document.getElementById('liveStatusDetail');
    const statusBadge = document.getElementById('statusBadge');

    let isOpen = false;
    let scheduleText = '';

    if (day === 0) {
      // Domingo: 9:00 AM a 5:00 PM
      isOpen = currentTimeVal >= 9 && currentTimeVal < 17;
      scheduleText = 'Hoy domingo: 9:00 AM a 5:00 PM';
    } else if (day === 6) {
      // Sábado: 8:00 AM a 7:00 PM
      isOpen = currentTimeVal >= 8 && currentTimeVal < 19;
      scheduleText = 'Hoy sábado: 8:00 AM a 7:00 PM';
    } else {
      // Lunes a Viernes: 8:00 AM a 7:00 PM
      isOpen = currentTimeVal >= 8 && currentTimeVal < 19;
      scheduleText = 'Hoy: 8:00 AM a 7:00 PM';
    }

    if (liveStatusTitle && liveStatusDetail) {
      if (isOpen) {
        liveStatusTitle.textContent = '🟢 ABIERTO AHORA';
        liveStatusTitle.style.color = '#a3e635';
        liveStatusDetail.textContent = `${scheduleText} · Te esperamos con gusto`;
      } else {
        liveStatusTitle.textContent = '🌙 CERRADO POR EL MOMENTO';
        liveStatusTitle.style.color = '#f87171';
        liveStatusDetail.textContent = 'Abrimos a las 8:00 AM · Déjanos tu mensaje por WhatsApp';
      }
    }

    if (statusBadge) {
      const badgeText = statusBadge.querySelector('.status-text');
      if (badgeText) {
        badgeText.textContent = isOpen 
          ? `Abierto hoy · ${scheduleText}` 
          : `Cerrado ahora · Abrimos en la mañana (${scheduleText})`;
      }
    }
  }

  checkStoreStatus();

  // 4. Copiar dirección al portapapeles
  const copyBtn = document.getElementById('copyAddressBtn');
  const addressText = document.getElementById('addressText');
  if (copyBtn && addressText) {
    copyBtn.addEventListener('click', async () => {
      const textToCopy = "Zapatería El Parche, Calle Principal Comercial (Tel: 302 832 1439)";
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✅ ¡Dirección Copiada!</span>';
        copyBtn.style.background = '#a3e635';
        copyBtn.style.color = '#000000';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2500);
      } catch (err) {
        alert("Dirección: " + textToCopy);
      }
    });
  }

  // 5. Cotizador por WhatsApp
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const shoeType = document.getElementById('shoeType').value;
      const serviceType = document.getElementById('serviceType').value;
      const userNotes = document.getElementById('userNotes').value.trim();

      let message = `¡Hola Zapatería El Parche! 👋\n\n`;
      message += `Quisiera cotizar un servicio para mi calzado:\n`;
      message += `👞 *Tipo de calzado:* ${shoeType}\n`;
      message += `🛠️ *Servicio solicitado:* ${serviceType}\n`;
      if (userNotes) {
        message += `📝 *Detalles adicionales:* ${userNotes}\n`;
      }
      message += `\n¿Qué precio tiene y en cuánto tiempo estaría listo? Gracias.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/573028321439?text=${encodedMessage}`;

      // Abrir WhatsApp en nueva pestaña
      window.open(whatsappUrl, '_blank');
    });
  }
});
