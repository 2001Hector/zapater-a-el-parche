import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Droplets, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone, 
  Send, 
  Navigation, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  FileCode2, 
  ChevronRight, 
  Maximize2, 
  X,
  Compass
} from 'lucide-react';
import JSZip from 'jszip';
import logoImg from './assets/logo.jpg';
import flyerImg from './assets/flyer.jpg';

// Datos de la zapatería
const PHONE_NUMBER = "302 832 1439";
const PHONE_RAW = "573028321439";
const ADDRESS_DISPLAY = "Cl. 10A #11-4, Maicao, La Guajira";
const GMAPS_URL = "https://www.google.com/maps/place/Instituto+Pedagogico+de+Maicao/@11.3724305,-72.2401716,57a,75y,230.07h,90t/data=!3m7!1e1!3m5!1sWuS50bcN_6oUXnxrZdxuTQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.google.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DWuS50bcN_6oUXnxrZdxuTQ%26yaw%3D230.07159025202776!7i13312!8i6656!4m24!1m17!1m13!4m12!1m4!2m2!1d-72.2334065!2d11.3769908!4e1!1m6!1m2!1s0x8e8bf3b0d7848f1b:0x55815f99b4605c28!2sCalzados+panda,+Cl+10A+%2311-4,+Maicao,+La+Guajira!2m2!1d-72.2379777!2d11.3767467!2m2!3m1!5e2!3m5!1s0x8e8bf3adf4877487:0xa10b7c622b8f6a1d!8m2!3d11.373466!4d-72.2375559!16s%2Fg%2F11h0zj5mt_?entry=ttu&g_ep=EgoyMDI2MTEwOS4wIKXMDSoASAFQAw%3D%3D";

export default function App() {
  // Estado de horario en tiempo real
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [flyerModalOpen, setFlyerModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [activeTabCode, setActiveTabCode] = useState<'html' | 'css' | 'js'>('html');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Estado del cotizador
  const [quoteShoe, setQuoteShoe] = useState("Tenis / Sneakers deportivos");
  const [quoteService, setQuoteService] = useState("Reparación (Suelas, tapas o costuras)");
  const [quoteNotes, setQuoteNotes] = useState("");

  // Cálculo del horario dinámico
  useEffect(() => {
    const updateTimeStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Domingo
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentDec = hour + minute / 60;

      if (day === 0) {
        // Domingo
        if (currentDec >= 9 && currentDec < 17) {
          setIsOpenNow(true);
          setStatusMessage("Abierto hoy domingo hasta las 5:00 PM");
        } else {
          setIsOpenNow(false);
          setStatusMessage("Cerrado por hoy · Abrimos mañana lunes a las 8:00 AM");
        }
      } else if (day === 6) {
        // Sábado
        if (currentDec >= 8 && currentDec < 19) {
          setIsOpenNow(true);
          setStatusMessage("Abierto hoy sábado hasta las 7:00 PM");
        } else {
          setIsOpenNow(false);
          setStatusMessage("Cerrado por hoy · Abrimos mañana domingo a las 9:00 AM");
        }
      } else {
        // Lunes a Viernes
        if (currentDec >= 8 && currentDec < 19) {
          setIsOpenNow(true);
          setStatusMessage("Abierto hoy hasta las 7:00 PM");
        } else {
          setIsOpenNow(false);
          setStatusMessage("Cerrado por hoy · Abrimos mañana a las 8:00 AM");
        }
      }
    };

    updateTimeStatus();
    const interval = setInterval(updateTimeStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Función para copiar dirección
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`Zapatería El Parche - ${ADDRESS_DISPLAY} (Tel: ${PHONE_NUMBER})`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Función para cotizar por WhatsApp
  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `¡Hola Zapatería El Parche! 👋\n\n`;
    text += `Quisiera cotizar un servicio para mi calzado:\n`;
    text += `👞 *Tipo de calzado:* ${quoteShoe}\n`;
    text += `🛠️ *Servicio solicitado:* ${quoteService}\n`;
    if (quoteNotes.trim()) {
      text += `📝 *Detalle:* ${quoteNotes.trim()}\n`;
    }
    text += `\n¿Qué precio tiene y qué tiempo tardaría el trabajo? Muchas gracias.`;

    const url = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Descarga del archivo ZIP estático para GitHub
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Cargar archivos estáticos generados
      const base = import.meta.env.BASE_URL || '/';
      const htmlRes = await fetch(`${base}static-site/index.html`);
      const htmlText = await htmlRes.text();
      zip.file('index.html', htmlText);

      const cssRes = await fetch(`${base}static-site/style.css`);
      const cssText = await cssRes.text();
      zip.file('style.css', cssText);

      const jsRes = await fetch(`${base}static-site/script.js`);
      const jsText = await jsRes.text();
      zip.file('script.js', jsText);

      // Cargar imagen del flyer y logo
      try {
        const imgRes = await fetch(flyerImg);
        const imgBlob = await imgRes.blob();
        zip.folder('img')?.file('flyer.jpg', imgBlob);
      } catch (err) {
        console.warn('Flyer img fetch skip', err);
      }

      try {
        const logoRes = await fetch(logoImg);
        const logoBlob = await logoRes.blob();
        zip.folder('img')?.file('logo.jpg', logoBlob);
      } catch (err) {
        console.warn('Logo img fetch skip', err);
      }

      // Archivo README con instrucciones para GitHub Pages
      const readmeContent = `# Zapatería El Parche - Sitio Web Estático

Este proyecto contiene todos los archivos listos para subir a tu repositorio Git (GitHub, GitLab, etc.) y publicarlo GRATIS en **GitHub Pages**.

## Estructura de archivos:
- \`index.html\`: Estructura principal, optimizada para SEO y móviles.
- \`style.css\`: Estilos visuales con colores oficiales (verde neón y modo oscuro).
- \`script.js\`: Cálculo automático de horario en tiempo real y cotizador de WhatsApp.
- \`img/\`: Carpeta con el volante/flyer oficial y gráficos.

## Pasos para publicar en GitHub Pages:
1. Crea un nuevo repositorio en GitHub (ej: \`zapateria-el-parche\`).
2. Sube todos los archivos de esta carpeta a la raíz del repositorio.
3. Ve a **Settings** > **Pages** en tu repositorio de GitHub.
4. En **Branch**, selecciona \`main\` y la carpeta \`/ (root)\`, luego dale a **Save**.
5. ¡Listo! En 1 minuto tendrás tu enlace gratis funcionando en internet.
`;
      zip.file('README.md', readmeContent);

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'zapateria-el-parche-estatico.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error generando zip', error);
      alert('Error al generar el ZIP. Puedes copiar los archivos directamente desde la ventana de código.');
    } finally {
      setIsZipping(false);
    }
  };

  // Código de ejemplo para ver/copiar
  const codeSnippets = {
    html: `<!-- index.html - Zapatería El Parche -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zapatería El Parche | Tu Calzado en Buenas Manos</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Contenido completo en el ZIP descargable -->
  <script src="script.js"></script>
</body>
</html>`,
    css: `/* style.css - Zapatería El Parche */
:root {
  --bg-dark: #0a0a0c;
  --brand-neon: #a3e635;
  --text-primary: #f8fafc;
}
/* Estilos modernos y responsivos incluidos */`,
    js: `// script.js - Zapatería El Parche
// Detección automática de horario abierto/cerrado y envío a WhatsApp
console.log("Zapatería El Parche listo");`
  };

  const handleCopyCodeTab = () => {
    navigator.clipboard.writeText(codeSnippets[activeTabCode]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-lime-400 selection:text-black">
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
          {/* Logo Brand Oficial */}
          <a href="#" className="flex items-center group">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-md border border-neutral-700/80 group-hover:border-lime-400 transition-colors flex items-center justify-center">
              <img 
                src={logoImg} 
                alt="Zapatería El Parche - Tu calzado en buenas manos" 
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
          </a>

          {/* Enlaces de Navegación */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
            <a href="#servicios" className="hover:text-lime-400 transition-colors">Servicios</a>
            <a href="#especialidades" className="hover:text-lime-400 transition-colors">Especialidades</a>
            <a href="#horario" className="hover:text-lime-400 transition-colors">Horario</a>
            <a href="#ubicacion" className="hover:text-lime-400 transition-colors">Ubicación & Mapa</a>
            <a href="#cotizar" className="hover:text-lime-400 transition-colors">Cotizador</a>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <a 
              href={`https://wa.me/${PHONE_RAW}?text=Hola%20Zapatería%20El%20Parche!%20Quisiera%20más%20información`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-lime-400 hover:bg-lime-300 text-black font-heading font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg shadow-lime-400/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
            >
              <Phone className="w-4 h-4 fill-black text-black" />
              <span>302 832 1439</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
          {/* Luz ambiental de fondo */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Columna Izquierda: Mensaje y llamadas a la acción */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Badge de Horario en vivo */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? 'bg-lime-400 animate-pulse shadow-sm shadow-lime-400' : 'bg-red-400'}`} />
                  <span>{statusMessage}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-lime-400">Atención todos los días</span>
                </div>

                <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-white">
                  DEVOLVEMOS LA VIDA A TUS{' '}
                  <span className="text-lime-400 underline decoration-lime-400/30 decoration-wavy">
                    ZAPATOS Y SNEAKERS
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Taller especializado en <strong>Reparación, Limpieza profunda y Restauración</strong> de calzado fino, tenis de colección y botas de trabajo. Acabados resistentes y garantizados.
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <a 
                    href={`https://wa.me/${PHONE_RAW}?text=Hola%20Zapatería%20El%20Parche,%20quiero%20cotizar%20un%20servicio%20para%20mi%20calzado`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-lime-400 hover:bg-lime-300 text-black font-heading font-black text-base px-6 py-4 rounded-xl shadow-xl shadow-lime-400/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <Send className="w-5 h-5 fill-black" />
                    <span>¡Escríbenos por WhatsApp!</span>
                  </a>

                  <a 
                    href="#ubicacion"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-base px-6 py-4 rounded-xl border border-neutral-700 hover:border-neutral-500 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-lime-400" />
                    <span>Cómo llegar (Mapa)</span>
                  </a>
                </div>

                {/* Métricas / Trust signals */}
                <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                  <div>
                    <div className="font-heading font-black text-2xl text-white">100%</div>
                    <div className="text-xs text-neutral-400">Trabajo Garantizado</div>
                  </div>
                  <div>
                    <div className="font-heading font-black text-2xl text-lime-400">7 Días</div>
                    <div className="text-xs text-neutral-400">Mañana a Tarde</div>
                  </div>
                  <div>
                    <div className="font-heading font-black text-2xl text-white">+10 Años</div>
                    <div className="text-xs text-neutral-400">Maestros Zapateros</div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Tarjeta del Volante Oficial con zoom */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                  <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-800 text-xs">
                      <span className="font-heading font-bold text-lime-400 tracking-wider">VOLANTE OFICIAL</span>
                      <button 
                        onClick={() => setFlyerModalOpen(true)}
                        className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                        title="Ampliar volante"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Ver completo</span>
                      </button>
                    </div>

                    <div 
                      className="overflow-hidden rounded-xl border border-neutral-800 cursor-pointer relative"
                      onClick={() => setFlyerModalOpen(true)}
                    >
                      <img 
                        src={flyerImg} 
                        alt="Zapatería El Parche - Volante oficial" 
                        className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-neutral-950/80 backdrop-blur-sm text-lime-400 text-xs px-3 py-1.5 rounded-full font-bold border border-lime-400/40 transition duration-200">
                          Toca para ampliar
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <span className="text-xs text-neutral-400">Línea de WhatsApp:</span>
                      <span className="font-heading font-black text-sm text-lime-400">{PHONE_NUMBER}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TRES PILARES PRINCIPALES (REPARACIÓN - LIMPIEZA - RESTAURACIÓN) */}
        <section id="servicios" className="py-16 md:py-24 bg-neutral-900/60 border-y border-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="font-heading font-bold text-xs uppercase tracking-widest text-lime-400 block mb-2">
                Nuestros 3 Pilares
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                Servicios especializados para tu calzado
              </h2>
              <p className="mt-3 text-neutral-400 text-sm sm:text-base">
                Materiales de primera calidad, pegantes de vulcanizado en caliente y técnicas artesanales que devuelven la comodidad original a tus pasos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* 1. REPARACIÓN */}
              <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-7 flex flex-col justify-between transition-all hover:-translate-y-1 group">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-neutral-800 flex items-center justify-center text-lime-400 mb-6 group-hover:bg-lime-400 group-hover:text-black transition-colors">
                    <Wrench className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-white mb-2 tracking-wide">
                    REPARACIÓN
                  </h3>
                  <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                    Soluciones estructurales para calzado desgastado, despegado o con suela vencida.
                  </p>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 border-t border-neutral-800/80 pt-5">
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Cambio de suelas completas y medias suelas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Tapas antideslizantes para tacones y botas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Pegado vulcanizado con prensado térmico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Costuras reforzadas a mano y a máquina</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Ensanche de horma y ajuste a tu pie</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t border-neutral-800">
                  <a 
                    href={`https://wa.me/${PHONE_RAW}?text=Hola%20Zapatería%20El%20Parche,%20quiero%20cotizar%20la%20REPARACIÓN%20de%20mis%20zapatos`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-colors"
                  >
                    <span>Cotizar Reparación</span>
                    <ChevronRight className="w-4 h-4 text-lime-400" />
                  </a>
                </div>
              </div>

              {/* 2. LIMPIEZA (Destacado) */}
              <div className="bg-neutral-900 border-2 border-lime-400/60 rounded-2xl p-7 flex flex-col justify-between transition-all hover:-translate-y-1 relative shadow-xl shadow-lime-500/5 group">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime-400 text-black font-heading font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Sneaker Wash Favorito
                </div>

                <div>
                  <div className="w-14 h-14 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-6 group-hover:bg-lime-400 group-hover:text-black transition-colors">
                    <Droplets className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-white mb-2 tracking-wide">
                    LIMPIEZA
                  </h3>
                  <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                    Lavado profundo artesanal a mano, desmanchado y desodorización sin deteriorar tejidos.
                  </p>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 border-t border-neutral-800/80 pt-5">
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Limpieza profunda de exterior, forro y plantilla</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Desamarillado y blanqueamiento de mediasuelas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Desinfección antibacteriana y secado controlado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Tratamiento especial de gamuza, nobuk y lona</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Lavado y planchado de cordones</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t border-neutral-800">
                  <a 
                    href={`https://wa.me/${PHONE_RAW}?text=Hola%20Zapatería%20El%20Parche,%20quiero%20cotizar%20la%20LIMPIEZA%20de%20mis%20tenis`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-heading font-extrabold text-xs py-3 px-4 rounded-xl transition-colors"
                  >
                    <span>Cotizar Limpieza de Tenis</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </a>
                </div>
              </div>

              {/* 3. RESTAURACIÓN */}
              <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-7 flex flex-col justify-between transition-all hover:-translate-y-1 group">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-neutral-800 flex items-center justify-center text-lime-400 mb-6 group-hover:bg-lime-400 group-hover:text-black transition-colors">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-white mb-2 tracking-wide">
                    RESTAURACIÓN
                  </h3>
                  <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                    Renovación estética completa de cueros desgastados, cambios de color y protección.
                  </p>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 border-t border-neutral-800/80 pt-5">
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Tintura integral y cambio de color con fijador</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Hidratación profunda con ceras y bálsamos nobles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Reparación de rayones y peladuras en punteras</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Aplicación de sellador nano-impermeabilizante</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>Brillo espejo profesional (glaseado) para cuero</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t border-neutral-800">
                  <a 
                    href={`https://wa.me/${PHONE_RAW}?text=Hola%20Zapatería%20El%20Parche,%20quiero%20cotizar%20la%20RESTAURACIÓN%20de%20mi%20calzado`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-colors"
                  >
                    <span>Cotizar Restauración</span>
                    <ChevronRight className="w-4 h-4 text-lime-400" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ESPECIALIDADES / TIPOS DE CALZADO */}
        <section id="especialidades" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="font-heading font-bold text-xs uppercase tracking-widest text-lime-400 block mb-2">
                Atendemos todo tipo de zapato
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                Las 3 siluetas que dominamos a la perfección
              </h2>
              <p className="mt-3 text-neutral-400 text-sm sm:text-base">
                Desde los sneakers más delicados de colección hasta las botas de uso rudo más exigentes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sneaker */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors">
                <div className="h-44 bg-gradient-to-b from-neutral-800 to-neutral-900 flex flex-col items-center justify-center p-6 text-center border-b border-neutral-800 relative">
                  <span className="text-6xl mb-2 filter drop-shadow-md">👟</span>
                  <span className="inline-block bg-neutral-950/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-lime-400 border border-neutral-800">
                    Tenis & Sneakers
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="font-heading font-bold text-lg text-white mb-2">
                    Sneakers Urbanos y Deportivos
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Nike Air Force 1, Jordan, Adidas Samba, Vans, New Balance, calzado de running y skate. Limpieza de capellada, pegado de punteras desprendidas y desamarillado de gomas.
                  </p>
                </div>
              </div>

              {/* Zapato Formal */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors">
                <div className="h-44 bg-gradient-to-b from-neutral-800 to-neutral-900 flex flex-col items-center justify-center p-6 text-center border-b border-neutral-800 relative">
                  <span className="text-6xl mb-2 filter drop-shadow-md">👞</span>
                  <span className="inline-block bg-neutral-950/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-lime-400 border border-neutral-800">
                    Elegancia & Cuero
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="font-heading font-bold text-lg text-white mb-2">
                    Zapatos de Vestir y Oficina
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Oxfords, Derby, mocasines, botines ejecutivos y calzado formal de dama o caballero. Cambio de tapas finas, suelas de suela vegetal, teñido profundo y lustre espejo de alta gala.
                  </p>
                </div>
              </div>

              {/* Botas */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors">
                <div className="h-44 bg-gradient-to-b from-neutral-800 to-neutral-900 flex flex-col items-center justify-center p-6 text-center border-b border-neutral-800 relative">
                  <span className="text-6xl mb-2 filter drop-shadow-md">🥾</span>
                  <span className="inline-block bg-neutral-950/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-lime-400 border border-neutral-800">
                    Botas Heavy Duty
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="font-heading font-bold text-lg text-white mb-2">
                    Botas de Trabajo y Montaña
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Timberland, Caterpillar, botas tácticas, senderismo y botas moteras. Suelas tractoradas antideslizantes, ojalillos metálicos, costura doble en talón y tratamientos impermeables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HORARIO DE ATENCIÓN (Desde la mañana hasta la tarde todos los días) */}
        <section id="horario" className="py-16 md:py-24 bg-neutral-900/40 border-y border-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
              
              {/* Información y Compromiso de Horario */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Disponibilidad 7 días</span>
                  </div>

                  <h3 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mb-4 leading-tight">
                    Horario continuo: desde la mañana hasta la tarde, todos los días
                  </h3>

                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                    Sabemos que tus horarios de trabajo son ajustados. Por eso en <strong>Zapatería El Parche</strong> estamos abiertos de lunes a domingo, recibiendo tu calzado a primera hora de la mañana y atendiendo hasta caer la tarde.
                  </p>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-sm text-white">¿Tienes un evento urgente?</h5>
                      <p className="text-xs text-neutral-400">Pregúntanos por entregas express en el mismo día o 24 horas.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <a 
                    href={`https://wa.me/${PHONE_RAW}?text=Hola,%20quisiera%20saber%20si%20puedo%20pasar%20hoy%20mismo%20a%20dejar%20unos%20zapatos`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-heading font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4 fill-black" />
                    <span>Confirmar horario por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Tabla de Horarios */}
              <div className="lg:col-span-5 bg-neutral-950 p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-lime-400" />
                    <span>Jornadas de Atención</span>
                  </h4>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400 bg-lime-400/10 px-2.5 py-0.5 rounded-full">
                    Activo
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <span className="text-sm font-semibold text-neutral-200">Lunes a Viernes</span>
                    <span className="font-heading font-bold text-sm text-lime-400">8:00 AM — 7:00 PM</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <span className="text-sm font-semibold text-neutral-200">Sábados</span>
                    <span className="font-heading font-bold text-sm text-lime-400">8:00 AM — 7:00 PM</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <span className="text-sm font-semibold text-neutral-200">Domingos</span>
                    <span className="font-heading font-bold text-sm text-lime-400">9:00 AM — 5:00 PM</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                    <span className="text-sm font-semibold text-neutral-200">Días Festivos</span>
                    <span className="font-heading font-bold text-sm text-lime-400">9:00 AM — 4:00 PM</span>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/80 text-center text-xs text-neutral-400">
                  📍 Recepción sin cita previa · Trae tus zapatos en cualquier momento del día
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECCIÓN DE UBICACIÓN Y MAPA ("CÓMO LLEGAR" CON GOOGLE MAPS DIRECTO) */}
        <section id="ubicacion" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="font-heading font-bold text-xs uppercase tracking-widest text-lime-400 block mb-2">
                ¿Dónde encontrarnos?
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                Ubicación & Cómo Llegar
              </h2>
              <p className="mt-3 text-neutral-400 text-sm sm:text-base">
                Toca el botón directo para iniciar la ruta en Google Maps desde tu celular o vehículo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Tarjeta de Datos y Botones Directos */}
              <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-lime-400 shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-lg text-white">Dirección de Atención</h4>
                      <p className="text-neutral-300 text-sm mt-0.5">{ADDRESS_DISPLAY}</p>
                      <span className="text-xs text-neutral-500 block mt-1">
                        Punto de fácil acceso con bahía para dejar y recoger calzado.
                      </span>
                    </div>
                  </div>

                  {/* BOTÓN DESTACADO CÓMO LLEGAR A GOOGLE MAPS */}
                  <a 
                    href={GMAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-lime-400 hover:bg-lime-300 text-black p-4 rounded-2xl flex items-center gap-4 shadow-xl shadow-lime-400/20 transition-all transform hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-black text-lime-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-heading font-black text-base sm:text-lg tracking-wide leading-tight">
                        CÓMO LLEGAR (ABRIR EN GOOGLE MAPS)
                      </span>
                      <span className="text-xs font-semibold text-neutral-900">
                        Inicia navegación GPS en tiempo real con 1 clic
                      </span>
                    </div>
                  </a>

                  {/* Acciones Secundarias de Mapa */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={handleCopyAddress}
                      className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold py-3 px-3 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
                    >
                      {copiedAddress ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedAddress ? "¡Copiada!" : "Copiar dirección"}</span>
                    </button>

                    <a 
                      href="https://waze.com/ul?q=Cl.%2010A%20%2311-4%2C%20Maicao%2C%20La%20Guajira"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold py-3 px-3 rounded-xl border border-neutral-700 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-lime-400" />
                      <span>Abrir en Waze</span>
                    </a>
                  </div>
                </div>

                {/* Banner de Contacto Telefónico y WhatsApp */}
                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-lime-400 block mb-1">
                    LÍNEA DIRECTA Y WHATSAPP
                  </span>
                  <a 
                    href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`} 
                    className="font-heading font-black text-3xl sm:text-4xl text-white hover:text-lime-400 transition-colors tracking-tight"
                  >
                    {PHONE_NUMBER}
                  </a>
                  <p className="text-xs text-neutral-400 mt-1">Escríbenos fotos de tu calzado antes de venir para darte el precio exacto</p>
                </div>
              </div>

              {/* Mapa Interactivo Integrado */}
              <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
                <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-neutral-200">
                    <span className="text-lime-400 text-base">📍</span>
                    <span>Taller Zapatería El Parche</span>
                  </div>
                  <a 
                    href={GMAPS_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lime-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Ver pantalla completa</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="relative flex-1 min-h-[360px] w-full">
                  <iframe 
                    title="Ubicación Zapatería El Parche en Google Maps"
                    src="https://www.google.com/maps?q=Cl.%2010A%20%2311-4%2C%20Maicao%2C%20La%20Guajira&output=embed"
                    className="w-full h-full min-h-[360px] border-0 filter invert-[0.9] hue-rotate-180 contrast-[0.95]"
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Pin flotante informativo sobre el mapa */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-xl p-3.5 shadow-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-lime-400 text-black flex items-center justify-center font-bold text-lg">
                      👟
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-white">Zapatería El Parche</div>
                      <div className="text-[11px] text-lime-400 font-medium">Abierto todos los días de mañana a tarde</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* COTIZADOR RÁPIDO INTERACTIVO POR WHATSAPP */}
        <section id="cotizar" className="py-16 md:py-24 bg-neutral-900/60 border-t border-neutral-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="font-heading font-bold text-xs uppercase tracking-widest text-lime-400 block mb-2">
                  Cotización Inmediata
                </span>
                <h3 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                  ¿Cuánto cuesta el arreglo de tus zapatos?
                </h3>
                <p className="mt-2 text-neutral-400 text-sm">
                  Elige tus opciones y nuestro sistema armará el mensaje directo para el maestro zapatero en WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSendQuote} className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    1. ¿Qué tipo de calzado deseas arreglar?
                  </label>
                  <select 
                    value={quoteShoe} 
                    onChange={(e) => setQuoteShoe(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-colors"
                  >
                    <option value="Tenis / Sneakers deportivos (Nike, Jordan, etc.)">Tenis / Sneakers deportivos (Nike, Jordan, Adidas, etc.)</option>
                    <option value="Zapatos formales de vestir o charol">Zapatos formales de vestir, ejecutivos o charol</option>
                    <option value="Botas de trabajo o montaña (Timberland, CAT, etc.)">Botas de trabajo o montaña (Timberland, CAT, etc.)</option>
                    <option value="Tacones finos o sandalias de dama">Tacones finos o calzado de dama</option>
                    <option value="Varios pares de calzado para mantenimiento">Varios pares de calzado (paquete por volumen)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    2. ¿Qué trabajo necesitas que le hagamos?
                  </label>
                  <select 
                    value={quoteService} 
                    onChange={(e) => setQuoteService(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-colors"
                  >
                    <option value="Reparación (Suelas, tapas antideslizantes o costuras)">Reparación (Suelas, tapas antideslizantes o costuras)</option>
                    <option value="Limpieza profunda (Lavado profundo a mano y gomas)">Limpieza profunda (Lavado profundo a mano y gomas)</option>
                    <option value="Restauración y tintura (Cambio de color o renovación de cuero)">Restauración y tintura (Cambio de color o renovación de cuero)</option>
                    <option value="Combo completo (Reparación de suela + Lavado profundo)">Combo completo (Reparación de suela + Lavado profundo)</option>
                    <option value="Consulta sobre un daño especial">Otro daño / Consulta personalizada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    3. Cuéntanos algún detalle (opcional):
                  </label>
                  <input 
                    type="text" 
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Ej: Suela despegada en el talón derecho o mancha de grasa..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-lime-400 hover:bg-lime-300 text-black font-heading font-black text-base py-4 px-6 rounded-xl shadow-xl shadow-lime-400/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-5 h-5 fill-black" />
                  <span>Enviar Cotización a WhatsApp ({PHONE_NUMBER})</span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center text-xs text-neutral-400">
                💬 Al presionar se abrirá tu aplicación de WhatsApp con los datos ya escritos para que solo le des "Enviar".
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-neutral-950 border-t border-neutral-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-3 py-1.5 border border-neutral-700 shrink-0">
              <img 
                src={logoImg} 
                alt="Zapatería El Parche - Tu calzado en buenas manos" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <span className="text-xs text-neutral-400 max-w-xs">
              Tu calzado en buenas manos · Reparación, limpieza y restauración artesanal.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <a href="#servicios" className="hover:text-lime-400 transition-colors">Servicios</a>
            <a href="#horario" className="hover:text-lime-400 transition-colors">Horarios</a>
            <a href="#ubicacion" className="hover:text-lime-400 transition-colors">Cómo llegar</a>
            <button 
              onClick={() => setExportModalOpen(true)}
              className="hover:text-lime-400 transition-colors underline cursor-pointer"
            >
              Archivos para Git
            </button>
          </div>

          <div className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Zapatería El Parche. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a 
        href={`https://wa.me/${PHONE_RAW}?text=Hola%20Zapatería%20El%20Parche!%20Quisiera%20cotizar%20un%20servicio%20para%20mi%20calzado`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-lime-400 hover:bg-lime-300 text-black rounded-full flex items-center justify-center shadow-2xl shadow-lime-400/40 transform hover:scale-110 transition-all group"
        aria-label="Contactar por WhatsApp"
      >
        <span className="text-2xl">💬</span>
        <span className="absolute right-16 bg-neutral-950 text-white border border-neutral-800 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          ¡Escríbenos por WhatsApp!
        </span>
      </a>

      {/* MODAL 1: LIGHTBOX DEL VOLANTE OFICIAL */}
      {flyerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
              <span className="font-heading font-black text-sm text-lime-400">VOLANTE ZAPATERÍA EL PARCHE</span>
              <button 
                onClick={() => setFlyerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-800 max-h-[75vh] flex items-center justify-center">
              <img 
                src={flyerImg} 
                alt="Volante oficial Zapatería El Parche" 
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">WhatsApp oficial: {PHONE_NUMBER}</span>
              <a 
                href={`https://wa.me/${PHONE_RAW}?text=Hola,%20vi%20el%20volante%20de%20Zapatería%20El%20Parche`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold px-4 py-2 rounded-lg"
              >
                Escribir al WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EXPORTAR ARCHIVOS PARA REPOSITORIO GIT (index.html, style.css, script.js, img/) */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="font-heading font-black text-xl text-white flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-lime-400" />
                  <span>Archivos Estáticos para tu Repositorio Git</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Estructura lista para subir a GitHub Pages: index.html, style.css, script.js e img/
                </p>
              </div>
              <button 
                onClick={() => setExportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guía rápida de 3 pasos */}
            <div className="my-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs space-y-2">
              <span className="font-bold text-lime-400 uppercase tracking-wider block">Cómo subir a tu repositorio Git gratis (GitHub Pages):</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-neutral-300">
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <strong className="text-white block mb-1">1. Descarga el ZIP</strong>
                  Presiona el botón de abajo para obtener la carpeta con todos los archivos listos.
                </div>
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <strong className="text-white block mb-1">2. Sube a GitHub</strong>
                  Crea tu repositorio y sube: <code className="text-lime-300">index.html</code>, <code className="text-lime-300">style.css</code>, <code className="text-lime-300">script.js</code> y la carpeta <code className="text-lime-300">img/</code>.
                </div>
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <strong className="text-white block mb-1">3. Activa Pages</strong>
                  En GitHub ve a <em>Settings &gt; Pages</em>, selecciona <em>main</em> y ¡tu web estará en línea gratis!
                </div>
              </div>
            </div>

            {/* Pestañas de previsualización de código */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveTabCode('html')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTabCode === 'html' ? 'bg-lime-400 text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                >
                  index.html
                </button>
                <button 
                  onClick={() => setActiveTabCode('css')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTabCode === 'css' ? 'bg-lime-400 text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                >
                  style.css
                </button>
                <button 
                  onClick={() => setActiveTabCode('js')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTabCode === 'js' ? 'bg-lime-400 text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                >
                  script.js
                </button>
              </div>

              <button 
                onClick={handleCopyCodeTab}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "¡Copiado!" : "Copiar archivo"}</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-300 max-h-48 mb-4">
              <pre>{codeSnippets[activeTabCode]}</pre>
            </div>

            {/* Botón de Descarga ZIP */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-neutral-400">
                Incluye la imagen del volante original en <code className="text-lime-300">img/flyer.jpg</code>
              </span>
              <button 
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-heading font-black text-sm px-6 py-3.5 rounded-xl shadow-xl shadow-lime-400/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isZipping ? "Empaquetando ZIP..." : "Descargar ZIP Completo para Git"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
