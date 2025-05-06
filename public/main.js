const listado = await fetch('./listado_clean.json').then((response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
    return [];
}); // Se carga el listado de radios desde el archivo JSON una vez al inicio

document.getElementById('searchInput').addEventListener('input', function (e) {
    if (listado.length === 0) {
        const etiqueta = document.createElement('li');
        const mensaje = document.createElement('strong');
        mensaje.textContent = '😔 Error al cargar los datos'
        etiqueta.appendChild(mensaje);
        document.getElementById('results').appendChild(etiqueta);
        return;
    }
    const query = this.value.toLowerCase().trim().replace(/\s+/g, ' ').split(' ');
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
            const nombreRadioStrong = document.createElement('strong');
            nombreRadioStrong.textContent = item.Nombre_Radio;
            const spanRadioInfo = document.createElement('span');
            spanRadioInfo.textContent = `🌍 ${item.Zona_Servicio} | 📶 ${item.Frecuencia} ${item.Tipo === 'AM' ? 'kHz' :  'MHz'} | ${item.Tipo === 'AM' ? '🟠' : item.Tipo === 'FM' ? '🔵' : '🟢'} ${item.Tipo}`;
            li.appendChild(nombreRadioStrong);
            li.appendChild(spanRadioInfo);
            li.classList.toggle(`${item.Tipo}`);
            li.addEventListener('click', () => showModal(item));
            resultsList.appendChild(li);
        });
});

function showModal(item) {
    const caracteristicas = [
        {nombre: '📡 Señal', valor: item.Señal},
        {nombre: '🎙️ Tipo', valor: item.Tipo},
        {nombre: '📋 Código Región', valor: item.Cod_Reg},
        {nombre: '🌎 Región', valor: item.Región},
        {nombre: '📍 Zona de Servicio', valor: item.Zona_Servicio},
        {nombre: '📻 Frecuencia', valor: `${item.Frecuencia} ${item.Tipo === 'AM' ? 'kHz' :  'MHz'}`},
        {nombre: '⚡ Potencia', valor: `${item.Potencia} W`},
        {nombre: '🏷️ Nombre de la Radio', valor: item.Nombre_Radio},
        {nombre: '🏢 Concesionaria', valor: item.Concesionaria},
        {nombre: '🆔 RUT', valor: item.RUT},
        {nombre: '📜 Tipo de Concesión', valor: item.Tipo_Concesión},
        {nombre: '📅 Fecha', valor: item.Fecha},
        {nombre: '🏠 Dirección del Estudio', valor: item.Dirección_Estudio},
        {nombre: '🏘️ Comuna del Estudio', valor: item.Comuna_Estudio},
        {nombre: '🌐 Región del Estudio', valor: item.Región_Estudio},
        {nombre: '📡 Dirección de la Antena', valor: item.Dirección_Planta},
        {nombre: '🏙️ Comuna de la Antena', valor: item.Comuna_Planta},
        {nombre: '🗺️ Región de la Antena', valor: item.Región_Planta},
        {nombre: '📍 Latitud antena', valor: item.Latitud},
        {nombre: '📍 Longitud antena', valor: item.Longitud}
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
    modal.scrollTo(0,0);
    modalContent.innerHTML = '';
    modal.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

document.getElementById('searchInput').value = 'bio bio';
document.getElementById('searchInput').dispatchEvent(new Event('input'));

document.getElementById('darkModeButton').addEventListener('click', function() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    this.textContent = isDarkMode ? '🌞' : '🌙';
    localStorage.setItem('darkMode', isDarkMode);
});