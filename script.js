// ==========================================================================
// Mobile Hamburger Menu Drawer
// ==========================================================================
const menuTrigger = document.getElementById('menu-trigger');
const menuCloseBtn = document.getElementById('menu-close-btn');
const menuDrawer = document.getElementById('menu-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerCloseTriggers = document.querySelectorAll('.drawer-close-trigger');

function openMenu() {
    menuDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeMenu() {
    menuDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuTrigger) menuTrigger.addEventListener('click', openMenu);
if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeMenu);

drawerCloseTriggers.forEach(trigger => {
    trigger.addEventListener('click', closeMenu);
});

// ==========================================================================
// Hero Section Calculator Logic
// ==========================================================================
let currentStep = 1;
let calcState = {
    type: null,        // 'vivienda' | 'negocio'
    hasAlarm: null,    // 'si' | 'no'
    propType: null,    // 'piso' | 'chalet' | 'bajo' | 'atico'
    habitual: null     // 'habitual' | 'segunda'
};

const backButton = document.getElementById('btn-calc-back');
const continueButton = document.getElementById('btn-calc-continue');
const progressBar = document.getElementById('calc-progress');

// DOM fields in calc form
const calcName = document.getElementById('calc-nombre');
const calcLastName = document.getElementById('calc-apellidos');
const calcCP = document.getElementById('calc-cp');
const calcPhone = document.getElementById('calc-telefono');
const calcLegal = document.getElementById('calc-legal');

function updateCalcUI() {
    // Hide all steps first
    document.querySelectorAll('.calculator-step').forEach(step => {
        step.classList.remove('active');
    });
    
    let activeStepElement = null;
    let progressPercentage = 20;
    
    if (currentStep === 1) {
        activeStepElement = document.getElementById('step-1');
        if (backButton) backButton.classList.remove('visible');
        progressPercentage = 20;
        
        // Continue enabled if type is selected
        if (continueButton) continueButton.disabled = !calcState.type;
        
    } else if (currentStep === 2) {
        activeStepElement = document.getElementById('step-2');
        if (backButton) backButton.classList.add('visible');
        progressPercentage = 40;
        
        if (continueButton) continueButton.disabled = !calcState.hasAlarm;
        
    } else if (currentStep === 3) {
        if (calcState.type === 'vivienda') {
            activeStepElement = document.getElementById('step-3-vivienda');
            progressPercentage = 60;
            if (continueButton) continueButton.disabled = !calcState.propType;
        } else {
            // Negocio goes straight to form (as step 3)
            activeStepElement = document.getElementById('step-form');
            progressPercentage = 80;
            validateFormStep();
        }
        if (backButton) backButton.classList.add('visible');
        
    } else if (currentStep === 4) {
        if (calcState.type === 'vivienda') {
            activeStepElement = document.getElementById('step-4-vivienda');
            progressPercentage = 80;
            if (continueButton) continueButton.disabled = !calcState.habitual;
        } else {
            // Negocio step 4 is result
            activeStepElement = document.getElementById('step-result');
            progressPercentage = 100;
            hideCalcNavButtons();
        }
        if (backButton) backButton.classList.add('visible');
        
    } else if (currentStep === 5) {
        if (calcState.type === 'vivienda') {
            activeStepElement = document.getElementById('step-form');
            progressPercentage = 90;
            validateFormStep();
        } else {
            // Not reachable for negocio
            currentStep = 4;
            updateCalcUI();
            return;
        }
        if (backButton) backButton.classList.add('visible');
        
    } else if (currentStep === 6) {
        activeStepElement = document.getElementById('step-result');
        progressPercentage = 100;
        hideCalcNavButtons();
    }
    
    if (activeStepElement) activeStepElement.classList.add('active');
    if (progressBar) progressBar.style.width = `${progressPercentage}%`;
}

function selectType(val) {
    calcState.type = val;
    // Update button styling
    document.querySelectorAll('#step-1 .calc-option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-value') === val) btn.classList.add('selected');
    });
    // Enable continue
    if (continueButton) continueButton.disabled = false;
}

function selectHasAlarm(val) {
    calcState.hasAlarm = val;
    document.querySelectorAll('#step-2 .calc-option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-value') === val) btn.classList.add('selected');
    });
    if (continueButton) continueButton.disabled = false;
}

function selectPropType(val) {
    calcState.propType = val;
    document.querySelectorAll('#step-3-vivienda .calc-option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-value') === val) btn.classList.add('selected');
    });
    if (continueButton) continueButton.disabled = false;
}

function selectResidenceType(val) {
    calcState.habitual = val;
    document.querySelectorAll('#step-4-vivienda .calc-option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-value') === val) btn.classList.add('selected');
    });
    if (continueButton) continueButton.disabled = false;
}

function validateFormStep() {
    const isNameOk = calcName && calcName.value.trim().length > 0;
    const isLastNameOk = calcLastName && calcLastName.value.trim().length > 0;
    const isCPOk = calcCP && calcCP.value.trim().length === 5;
    const isPhoneOk = calcPhone && calcPhone.value.trim().length >= 9;
    const isLegalOk = calcLegal && calcLegal.checked;
    
    if (continueButton) {
        continueButton.disabled = !(isNameOk && isLastNameOk && isCPOk && isPhoneOk && isLegalOk);
    }
}

// Add event listeners for form validation
[calcName, calcLastName, calcCP, calcPhone, calcLegal].forEach(field => {
    if (field) {
        field.addEventListener('input', validateFormStep);
        field.addEventListener('change', validateFormStep);
    }
});

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateCalcUI();
    }
}

function nextStep() {
    // If we are on the form step, submitting leads to result
    const isFormStep = (calcState.type === 'vivienda' && currentStep === 5) || (calcState.type === 'negocio' && currentStep === 3);
    
    if (isFormStep) {
        console.log('Lead Submitted - Calculator Data:', calcState);
        console.log('Contact Details:', {
            nombre: calcName.value,
            apellidos: calcLastName.value,
            cp: calcCP.value,
            telefono: calcPhone.value
        });
        currentStep = 6;
    } else {
        currentStep++;
    }
    updateCalcUI();
}

function hideCalcNavButtons() {
    const navDiv = document.getElementById('calc-nav-buttons');
    if (navDiv) navDiv.style.display = 'none';
}

function resetCalculator() {
    currentStep = 1;
    calcState = { type: null, hasAlarm: null, propType: null, habitual: null };
    
    // Clear styles
    document.querySelectorAll('.calculator-step .calc-option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Clear inputs
    if (calcName) calcName.value = '';
    if (calcLastName) calcLastName.value = '';
    if (calcCP) calcCP.value = '';
    if (calcPhone) calcPhone.value = '';
    if (calcLegal) calcLegal.checked = false;
    
    // Restore nav buttons
    const navDiv = document.getElementById('calc-nav-buttons');
    if (navDiv) navDiv.style.display = 'flex';
    
    updateCalcUI();
}


// ==========================================================================
// Bottom Calculator (Simplified Form)
// ==========================================================================
let bottomType = 'vivienda';

function setBottomType(val) {
    bottomType = val;
    document.getElementById('bottom-type-vivienda').classList.remove('active-opt');
    document.getElementById('bottom-type-negocio').classList.remove('active-opt');
    
    if (val === 'vivienda') {
        document.getElementById('bottom-type-vivienda').classList.add('active-opt');
    } else {
        document.getElementById('bottom-type-negocio').classList.add('active-opt');
    }
}

function submitBottomForm() {
    const name = document.getElementById('bottom-calc-nombre').value;
    const phone = document.getElementById('bottom-calc-telefono').value;
    const cp = document.getElementById('bottom-calc-cp').value;
    const legal = document.getElementById('bottom-calc-legal').checked;
    
    if (name.trim() && phone.trim() && cp.trim() && legal) {
        console.log('Lead Submitted - Bottom Calculator:', {
            tipo: bottomType,
            nombre: name,
            telefono: phone,
            cp: cp
        });
        
        document.getElementById('bottom-res-type').textContent = bottomType;
        document.getElementById('bottom-result-msg').style.display = 'block';
        document.getElementById('bottom-submit-btn').style.display = 'none';
    }
}


// ==========================================================================
// Product Carousel Slider
// ==========================================================================
let activeSlideIndex = 0;
const totalSlides = 12;

const selectionItems = document.querySelectorAll('#product-selection-grid .grid-nav-item');
const slides = document.querySelectorAll('#product-slider .product-slide');
const dots = document.querySelectorAll('#carousel-dots .dot-btn');

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    activeSlideIndex = index;
    
    // Update active nav item
    selectionItems.forEach((item, idx) => {
        item.classList.remove('active');
        if (idx === index) item.classList.add('active');
    });
    
    // Update active slide
    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (idx === index) slide.classList.add('active');
    });
    
    // Update active dot
    dots.forEach((dot, idx) => {
        dot.classList.remove('active');
        if (idx === index) dot.classList.add('active');
    });
    
    // Scroll active nav item into view inside grid scroll area
    const activeItem = selectionItems[index];
    if (activeItem) {
        activeItem.parentNode.scrollTo({
            left: activeItem.offsetLeft - activeItem.parentNode.offsetWidth / 2 + activeItem.offsetWidth / 2,
            behavior: 'smooth'
        });
    }
}

function slideNext() {
    let nextIdx = activeSlideIndex + 1;
    if (nextIdx >= totalSlides) nextIdx = 0;
    goToSlide(nextIdx);
}

function slidePrev() {
    let prevIdx = activeSlideIndex - 1;
    if (prevIdx < 0) prevIdx = totalSlides - 1;
    goToSlide(prevIdx);
}

// Bind navigation click triggers
selectionItems.forEach((item) => {
    item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        goToSlide(idx);
    });
});

dots.forEach((dot) => {
    dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(idx);
    });
});


// ==========================================================================
// FAQ Accordion categories & items
// ==========================================================================
const faqDatabase = {
    'sobre-alarmas': [
        {
            q: '¿Qué es alarmashogar.es?',
            a: 'Alarmashogar.es es una división de <b>alarmasyseguridad.net</b>. Somos expertos en instalación de alarmas y sistemas de seguridad. Trabajamos con las mejores marcas del mercado para ofrecerte soluciones a medida que protejan tu hogar y negocio con la más alta tecnología. <br/><br/>Ofrecemos <b>instalación profesional, mantenimiento</b> y <b>soporte técnico</b> para garantizar tu tranquilidad.'
        },
        {
            q: '¿Por qué confiar en alarmashogar.es para proteger lo que más amas?',
            a: 'Porque somos distribuidores autorizados de las principales compañías de seguridad en España, garantizando sistemas homologados de alta tecnología conectados las 24 horas del día a una Central Receptora de Alarmas (CRA) con aviso a la policía. Además, te aseguramos el mejor precio promocional del mercado de forma transparente.'
        },
        {
            q: '¿En qué zonas operamos?',
            a: 'Ofrecemos cobertura de instalación y servicio técnico en todo el territorio nacional (España), contando con técnicos locales certificados en todas las provincias para garantizar una asistencia rápida y un mantenimiento eficaz.'
        },
        {
            q: '¿Cuál es el teléfono de alarmashogar.es?',
            a: 'Puedes contactar con nosotros de forma gratuita llamando al teléfono <b>911 309 222</b> para información general y contrataciones en España, o al <b>935 565 012</b> si te encuentras en Cataluña. Nuestro horario de atención comercial es de lunes a viernes.'
        }
    ],
    'equipamiento': [
        {
            q: '¿Qué dispositivos incluye el equipo básico de alarma?',
            a: 'El kit de alarma básico incluye una central inteligente que conecta todos los elementos, teclado numérico de control, detectores magnéticos de apertura para puertas o ventanas, llaves inteligentes para activación sin código y carteles disuasorios para el exterior de la propiedad.'
        },
        {
            q: '¿Qué es la tecnología anti-inhibición?',
            a: 'Es un sistema de seguridad de doble transmisión (móvil y ethernet) que evita sabotajes mediante inhibidores de radiofrecuencia. Si la señal es interferida, la central conmuta de red de forma instantánea y emite una señal de alarma de sabotaje a la Central Receptora CRA.'
        },
        {
            q: '¿Las alarmas de alarmashogar.es son compatibles con mascotas?',
            a: 'Sí, disponemos de detectores con tecnología Pet Friendly inmunizados para no saltar con animales de compañía de hasta 20kg. De esta manera, tu mascota podrá pasearse libremente por la propiedad mientras la alarma está activa.'
        }
    ],
    'funcionamiento': [
        {
            q: '¿Cómo actúa la alarma ante un intento de intrusión?',
            a: 'Cuando un sensor detecta movimiento o apertura, transmite una alerta inmediata a la central receptora CRA. El equipo con cámara captura fotos y el operador verifica la intrusión en 9 segundos. Si se confirma el peligro, se notifica inmediatamente a la Policía y se activa la sirena acústica.'
        },
        {
            q: '¿Qué pasa si activo la alarma por error (falsa alarma)?',
            a: 'Dispondrás de un tiempo de cortesía configurable para introducir tu código en el teclado. Si no se introduce, la CRA se pondrá en contacto contigo por teléfono o voz. Bastará con indicar tu palabra clave de seguridad para cancelar el aviso de forma gratuita.'
        },
        {
            q: '¿Tengo que dejar la alarma encendida cuando estoy dentro de casa?',
            a: 'No es obligatorio, pero sí recomendable mediante el modo de "Activación Parcial". Este modo protege el perímetro (puertas y ventanas exteriores) mientras tú puedes moverte libremente por el interior. Es idóneo para dormir tranquilo por la noche.'
        }
    ],
    'proteccion': [
        {
            q: '¿Está la alarma conectada a la policía las 24 horas?',
            a: 'Sí, todas nuestras alarmas contratadas se conectan a una Central Receptora de Alarmas (CRA) homologada por el Ministerio del Interior. Esta CRA está activa las 24 horas del día, los 365 días del año, para el aviso directo a la policía y emergencias.'
        },
        {
            q: '¿Qué pasa si hay un corte de luz en la vivienda?',
            a: 'El sistema dispone de baterías de respaldo de alta capacidad tanto en la central como en los sensores. La alarma continuará totalmente operativa durante cortes de suministro de hasta 24 horas, notificando también el corte eléctrico a tu móvil.'
        },
        {
            q: '¿Cómo previene el sistema la ocupación ilegal?',
            a: 'Al contar con verificación por imagen en vivo y estar conectada a una CRA homologada, el aviso a la policía se realiza en flagrante delito de intrusión. Esto permite a las autoridades actuar de forma rápida y proceder al desalojo inmediato, lo cual no ocurre en alarmas no conectadas.'
        }
    ],
    'instalacion': [
        {
            q: '¿Cuánto tiempo tardan en instalar la alarma?',
            a: 'La instalación estándar dura menos de 2 horas. El técnico homologado no necesita realizar obras ni cableados complejos, y antes de retirarse te enseñará a utilizar el sistema y configurar la aplicación en tu móvil.'
        },
        {
            q: '¿La instalación tiene algún tipo de coste?',
            a: 'No, gracias a la promoción activa de este mes, el alta del servicio y la instalación profesional realizada por un técnico homologado son totalmente gratuitas.'
        },
        {
            q: '¿El mantenimiento de los equipos está incluido?',
            a: 'Sí, el mantenimiento preventivo y correctivo es total y de por vida mientras dure el contrato. Incluye la sustitución de baterías gastadas, reparación de sensores averiados y actualizaciones de software sin ningún coste adicional para ti.'
        }
    ],
    'app-movil': [
        {
            q: '¿Cómo funciona la aplicación móvil de la alarma?',
            a: 'Nuestra app gratuita te permite armar y desarmar el sistema en modo total o parcial de forma remota, ver fotos del interior bajo petición, revisar el historial de entradas y salidas, y recibir notificaciones instantáneas de eventos en tu smartphone.'
        },
        {
            q: '¿Puedo solicitar imágenes de mi hogar en cualquier momento?',
            a: 'Sí, a través de la aplicación puedes solicitar fotos en tiempo real del detector con cámara o ver el vídeo en vivo si dispones de la cámara IP adicional instalada en tu vivienda.'
        },
        {
            q: '¿Es compatible con cualquier teléfono?',
            a: 'Sí, la aplicación oficial de control de la alarma es totalmente compatible con teléfonos móviles y tablets Android, así como con dispositivos iOS de Apple (iPhone y iPad).'
        }
    ]
};

const faqTabs = document.querySelectorAll('#faq-categories .faq-category-btn');
const faqContentContainer = document.getElementById('faq-content-box');

function renderFAQCategory(categoryKey) {
    if (!faqContentContainer || !faqDatabase[categoryKey]) return;
    
    const questions = faqDatabase[categoryKey];
    faqContentContainer.innerHTML = ''; // Clear previous questions
    
    const containerDiv = document.createElement('div');
    containerDiv.className = 'faq-questions-container';
    
    questions.forEach((item, idx) => {
        const faqItem = document.createElement('div');
        faqItem.className = `faq-item ${idx === 0 ? 'active' : ''}`; // First item expanded by default
        
        const questionBtn = document.createElement('button');
        questionBtn.className = 'faq-question-btn';
        questionBtn.setAttribute('aria-expanded', idx === 0 ? 'true' : 'false');
        questionBtn.innerHTML = `
            <span>${item.q}</span>
            <span class="faq-chevron-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-${idx === 0 ? 'up' : 'down'}"><polyline points="${idx === 0 ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline></svg>
            </span>
        `;
        
        const answerDiv = document.createElement('div');
        answerDiv.className = 'faq-answer-collapse';
        answerDiv.innerHTML = `<p>${item.a}</p>`;
        
        questionBtn.addEventListener('click', () => {
            const isActive = faqItem.classList.contains('active');
            
            // Collapse other questions in this container
            containerDiv.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                const btn = otherItem.querySelector('.faq-question-btn');
                if (btn) {
                    btn.setAttribute('aria-expanded', 'false');
                    btn.querySelector('.faq-chevron-icon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                }
            });
            
            // Toggle clicked question
            if (!isActive) {
                faqItem.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
                questionBtn.querySelector('.faq-chevron-icon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg>';
            }
        });
        
        faqItem.appendChild(questionBtn);
        faqItem.appendChild(answerDiv);
        containerDiv.appendChild(faqItem);
    });
    
    faqContentContainer.appendChild(containerDiv);
}

// Bind tabs clicks
faqTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        faqTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const category = tab.getAttribute('data-category');
        renderFAQCategory(category);
    });
});

// Initial render
renderFAQCategory('sobre-alarmas');


// ==========================================================================
// Contact Traditional Form Submission
// ==========================================================================
function submitContactForm() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const cp = document.getElementById('codigoPostal').value;
    const mensaje = document.getElementById('mensaje').value;
    
    console.log('Contact Message Submitted:', {
        nombre: nombre,
        email: email,
        telefono: telefono,
        cp: cp,
        mensaje: mensaje
    });
    
    document.getElementById('contact-success-msg').style.display = 'block';
    document.getElementById('contact-submit-btn').style.display = 'none';
}


// ==========================================================================
// Conditions Section Toggle
// ==========================================================================
function toggleConditions() {
    const body = document.getElementById('conditions-body');
    const btn = document.getElementById('conds-btn');
    const isOpen = body.classList.contains('open');
    
    if (isOpen) {
        body.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
    } else {
        body.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
    }
}



// ==========================================================================
// Privacy Modal Actions
// ==========================================================================
const privacyModal = document.getElementById('privacy-modal');

function openPrivacyModal() {
    if (privacyModal) {
        privacyModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closePrivacyModal() {
    if (privacyModal) {
        privacyModal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close modal on click outside box
if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            closePrivacyModal();
        }
    });
}

// ==========================================================================
// Calculator Modal Actions
// ==========================================================================
const calculatorModal = document.getElementById('calculator-modal');

function openCalculatorModal() {
    if (calculatorModal) {
        calculatorModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCalculatorModal() {
    if (calculatorModal) {
        calculatorModal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close modal on click outside box
if (calculatorModal) {
    calculatorModal.addEventListener('click', (e) => {
        if (e.target === calculatorModal) {
            closeCalculatorModal();
        }
    });
}

// Manual Modal Actions
const manualModal = document.getElementById('manual-modal');

function openManualModal() {
    if (manualModal) {
        manualModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeManualModal() {
    if (manualModal) {
        manualModal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

if (manualModal) {
    manualModal.addEventListener('click', (e) => {
        if (e.target === manualModal) {
            closeManualModal();
        }
    });
}

