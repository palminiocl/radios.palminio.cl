const listado = await fetch('./listado_clean.json').then((response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
    return [];
}); // Se carga el listado de radios desde el archivo JSON una vez al inicio

// Variables globales para el mapa
let mainMap = null;
let markersLayer = null;
let currentView = 'list'; // 'list' o 'map'

// Función para inicializar el mapa principal
function initMainMap() {
    if (!mainMap) {
        mainMap = L.map('mainMap').setView([-33.4489, -70.6693], 5); // Centrado en Chile
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(mainMap);
        
        markersLayer = L.layerGroup().addTo(mainMap);
    }
}

// Función para actualizar el mapa con los resultados
function updateMap(results) {
    if (!mainMap) {
        initMainMap();
    }
    
    // Limpiar marcadores anteriores
    markersLayer.clearLayers();
    
    // Añadir marcadores para cada radio con coordenadas
    const validResults = results.filter(item => item.Latitud != null && item.Longitud != null);
    
    validResults.forEach(item => {
        const marker = L.marker([item.Latitud, item.Longitud]);
        
        // Personalizar icono según el tipo
        const iconColor = item.Tipo === 'AM' ? '🟠' : item.Tipo === 'FM' ? '🔵' : '🟢';
        
        const popupContent = `
            <strong>${item.Nombre_Radio}</strong><br>
            <b>Frecuencia:</b> ${item.Frecuencia} ${item.Tipo === 'AM' ? 'kHz' : 'MHz'}<br>
            <b>Tipo:</b> ${iconColor} ${item.Tipo}<br>
            <b>Zona:</b> ${item.Zona_Servicio}
        `;
        
        marker.bindPopup(popupContent);
        marker.on('click', () => showModal(item));
        markersLayer.addLayer(marker);
    });
    
    // Ajustar vista del mapa si hay marcadores
    if (validResults.length > 0) {
        const bounds = L.latLngBounds(validResults.map(item => [item.Latitud, item.Longitud]));
        mainMap.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Forzar re-render del mapa
    setTimeout(() => {
        if (mainMap) {
            mainMap.invalidateSize();
        }
    }, 100);
}

// Función para cambiar entre vistas
function switchView(view) {
    currentView = view;
    
    const listView = document.getElementById('results');
    const mapView = document.getElementById('mapContainer');
    const listBtn = document.getElementById('listViewBtn');
    const mapBtn = document.getElementById('mapViewBtn');
    
    if (view === 'list') {
        listView.style.display = '';
        mapView.style.display = 'none';
        listBtn.classList.add('active');
        mapBtn.classList.remove('active');
    } else {
        listView.style.display = 'none';
        mapView.style.display = 'block';
        listBtn.classList.remove('active');
        mapBtn.classList.add('active');
        
        // Inicializar y actualizar el mapa
        if (!mainMap) {
            initMainMap();
        }
        
        // Obtener resultados actuales y actualizar mapa
        const query = document.getElementById('searchInput').value.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').split(' ');
        
        if (query.length > 0 && query[0] !== '') {
            const results = listado.filter(item =>
                query.every(term =>
                    (item.Nombre_Radio && item.Nombre_Radio.toLowerCase().includes(term)) ||
                    (item.Frecuencia && item.Frecuencia.toString().toLowerCase().includes(term)) ||
                    (item.Zona_Servicio && item.Zona_Servicio.toLowerCase().includes(term))
                )
            );
            updateMap(results);
        } else {
            updateMap(listado);
        }
        
        setTimeout(() => {
            mainMap.invalidateSize();
        }, 100);
    }
}

// Event listeners para los botones de vista
document.getElementById('listViewBtn').addEventListener('click', () => switchView('list'));
document.getElementById('mapViewBtn').addEventListener('click', () => switchView('map'));

document.getElementById('searchInput').addEventListener('input', function (e) {
    if (listado.length === 0) {
        const etiqueta = document.createElement('li');
        const mensaje = document.createElement('strong');
        mensaje.textContent = '😔 Error al cargar los datos'
        etiqueta.appendChild(mensaje);
        document.getElementById('results').appendChild(etiqueta);
        return;
    }
    const query = this.value.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').split(' ');

    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';

    if (query.length === 1 && query[0] === '') {
        return; // No mostrar resultados si la query está vacía
    }

    const results = listado.filter(item =>
        query.every(term =>
            (item.Nombre_Radio && item.Nombre_Radio.toLowerCase().includes(term)) ||
            (item.Frecuencia && item.Frecuencia.toString().toLowerCase().includes(term)) ||
            (item.Zona_Servicio && item.Zona_Servicio.toLowerCase().includes(term))
        )
    );

    results.forEach(item => { // Crear un elemento <li> para cada resultado
        const li = document.createElement('li');
        const div = document.createElement('div');
        const nombreRadioStrong = document.createElement('strong');

        const seleccionar = document.createElement('input');
        seleccionar.type = 'checkbox';
        seleccionar.classList.add('checkbox');
        seleccionar.id = item.Señal.replace(/\s+/g, '_');

        nombreRadioStrong.textContent = item.Nombre_Radio;
        const spanRadioInfo = document.createElement('span');
        spanRadioInfo.textContent = `🌍 ${item.Zona_Servicio} | 📶 ${item.Frecuencia} ${item.Tipo === 'AM' ? 'kHz' : 'MHz'} | ${item.Tipo === 'AM' ? '🟠' : item.Tipo === 'FM' ? '🔵' : '🟢'} ${item.Tipo}`;
        div.appendChild(nombreRadioStrong);
        div.appendChild(spanRadioInfo);
        li.appendChild(seleccionar);
        li.appendChild(div);

        li.classList.toggle(`${item.Tipo}`);
        div.addEventListener('click', () => showModal(item));
        resultsList.appendChild(li);
    });
    
    // Actualizar mapa si está en vista de mapa
    if (currentView === 'map') {
        updateMap(results);
    }
});
document.getElementById('showButtons').addEventListener('click', function () {
    document.getElementsByClassName('conBotones')[0].style.display = 'flex';
    document.getElementsByClassName('sinBotones')[0].style.display = 'none';
}
);
document.getElementById('hideButtons').addEventListener('click', function () {
    document.getElementsByClassName('conBotones')[0].style.display = 'none';
    document.getElementsByClassName('sinBotones')[0].style.display = 'flex';
}
);
document.getElementById('darkModeButton').addEventListener('click', function () {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    this.textContent = isDarkMode ? '🌞' : '🌙';
    localStorage.setItem('darkMode', isDarkMode);
});

document.getElementById('downloadButton').addEventListener('click', () => {
    const selectedRadios = Array.from(document.querySelectorAll('.checkbox:checked')).map(checkbox => {
        const id_radio = checkbox.id;
        const radio = listado.filter(item => item.Señal === id_radio)[0];
        return radio;
    });

    if (selectedRadios.length === 0) {
        alert('No hay radios seleccionadas para descargar.');
        return;
    }

    const blob = new Blob([JSON.stringify(selectedRadios, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'radios_seleccionadas.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
);
document.getElementById('clearButton').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}
);
document.getElementById('sugerenciaButton').addEventListener('click', () => {
    const url = "https://forms.gle/7dGurm1aMaSnqeT56"
    if (url) {
        window.open(url, '_blank');
    }
}
);
function showModal(item) {
    const caracteristicas = [
        { nombre: '📡 Señal', valor: item.Señal },
        { nombre: '🎙️ Tipo', valor: item.Tipo },
        { nombre: '📋 Código Región', valor: item.Cod_Reg },
        { nombre: '🌎 Región', valor: item.Región },
        { nombre: '📍 Zona de Servicio', valor: item.Zona_Servicio },
        { nombre: '📻 Frecuencia', valor: `${item.Frecuencia} ${item.Tipo === 'AM' ? 'kHz' : 'MHz'}` },
        { nombre: '⚡ Potencia', valor: `${item.Potencia} W` },
        { nombre: '🏷️ Nombre de la Radio', valor: item.Nombre_Radio },
        { nombre: '🏢 Concesionaria', valor: item.Concesionaria },
        { nombre: '🆔 RUT', valor: item.RUT },
        { nombre: '📜 Tipo de Concesión', valor: item.Tipo_Concesión },
        { nombre: '📅 Fecha', valor: item.Fecha },
        { nombre: '🏠 Dirección del Estudio', valor: item.Dirección_Estudio },
        { nombre: '🏘️ Comuna del Estudio', valor: item.Comuna_Estudio },
        { nombre: '🌐 Región del Estudio', valor: item.Región_Estudio },
        { nombre: '📡 Dirección de la Antena', valor: item.Dirección_Planta },
        { nombre: '🏙️ Comuna de la Antena', valor: item.Comuna_Planta },
        { nombre: '🗺️ Región de la Antena', valor: item.Región_Planta },
        { nombre: '📍 Latitud antena', valor: item.Latitud },
        { nombre: '📍 Longitud antena', valor: item.Longitud }
    ]
    document.getElementById('modalTitle').textContent = item.Nombre_Radio;
    caracteristicas.forEach(caracteristica => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${caracteristica.nombre}:</strong> ${caracteristica.valor}`;
        modalContent.appendChild(p);
    });
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    modalContent.appendChild(mapContainer);

    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    setTimeout(() => {
        if (item.Latitud != null && item.Longitud != null) {
            const map = L.map('map').setView([item.Latitud, item.Longitud], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);

            L.marker([item.Latitud, item.Longitud]).addTo(map)
                .bindPopup(`<strong>${item.Nombre_Radio}</strong><br>${item.Zona_Servicio}`)
                .openPopup();

            map.invalidateSize(); // <-- fuerza el re-render del mapa
        } else {
            document.getElementById('map').innerHTML = '<p>Ubicación no disponible</p>';
        }
    }, 100); // pequeño retardo para dar tiempo a que el modal se muestre

}


document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('overlay').addEventListener('click', closeModal);

function closeModal() {
    const modal = document.getElementById('modal');
    modal.scrollTo(0, 0);
    modalContent.innerHTML = '';
    modal.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

document.getElementById('searchInput').value = 'bio bio';
document.getElementById('searchInput').dispatchEvent(new Event('input'));

