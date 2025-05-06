document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase().trim().replace(/\s+/g, ' ').split(' ');
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';

    if (query.length === 1 && query[0] === '') {
    return; // No mostrar resultados si la query está vacía
    }

    fetch('./listado_clean.json')
    .then(response => response.json())
    .then(data => {
        const results = data.filter(item => 
        query.every(term => 
            (item.Nombre_Radio && item.Nombre_Radio.toLowerCase().includes(term)) ||
            (item.Frecuencia && item.Frecuencia.toString().toLowerCase().includes(term)) ||
            (item.Zona_Servicio && item.Zona_Servicio.toLowerCase().includes(term))
        )
        );

        results.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.Nombre_Radio}</strong>
            <span style="margin-top: 5px;">🌍 ${item.Zona_Servicio} &nbsp;|&nbsp; 📶 ${item.Frecuencia} MHz &nbsp;|&nbsp; 
            ${item.Tipo === 'AM' ? '🟠' : item.Tipo === 'FM' ? '🔵' : '🟢'} ${item.Tipo}</span>`;
        li.addEventListener('click', () => showModal(item));
        resultsList.appendChild(li);
        });
    });
});

function showModal(item) {
    document.getElementById('modalTitle').textContent = item.Nombre_Radio;
    document.getElementById('modalContent').innerHTML = `
        <p><strong>📡 Señal:</strong> ${item.Señal}</p>
        <p><strong>🎙️ Tipo:</strong> ${item.Tipo}</p>
        <p><strong>📋 Código Región:</strong> ${item.Cod_Reg}</p>
        <p><strong>🌎 Región:</strong> ${item.Región}</p>
        <p><strong>📍 Zona de Servicio:</strong> ${item.Zona_Servicio}</p>
        <p><strong>📻 Frecuencia:</strong> ${item.Frecuencia}</p>
        <p><strong>⚡ Potencia:</strong> ${item.Potencia}</p>
        <p><strong>🏷️ Nombre de la Radio:</strong> ${item.Nombre_Radio}</p>
        <p><strong>🏢 Concesionaria:</strong> ${item.Concesionaria}</p>
        <p><strong>🆔 RUT:</strong> ${item.RUT}</p>
        <p><strong>📜 Tipo de Concesión:</strong> ${item.Tipo_Concesión}</p>
        <p><strong>📅 Fecha:</strong> ${item.Fecha}</p>
        <p><strong>🏠 Dirección del Estudio:</strong> ${item.Dirección_Estudio}</p>
        <p><strong>🏘️ Comuna del Estudio:</strong> ${item.Comuna_Estudio}</p>
        <p><strong>🌐 Región del Estudio:</strong> ${item.Región_Estudio}</p>
        <p><strong>📡 Dirección de la Antena:</strong> ${item.Dirección_Planta}</p>
        <p><strong>🏙️ Comuna de la Antena:</strong> ${item.Comuna_Planta}</p>
        <p><strong>🗺️ Región de la Antena:</strong> ${item.Región_Planta}</p>
        <p><strong>📍 Latitud antena:</strong> ${item.Latitud}</p>
        <p><strong>📍 Longitud antena:</strong> ${item.Longitud}</p>
        <p><strong>🗺️ Datum:</strong> ${item.Datum}</p>
        <div id="map"></div>
    `;

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
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

document.getElementById('searchInput').value = 'bio bio';
document.getElementById('searchInput').dispatchEvent(new Event('input'));