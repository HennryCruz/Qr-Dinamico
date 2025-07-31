
// Configuración de Supabase
const supabaseUrl = 'https://fbmdevivfhesggervjjy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibWRldml2Zmhlc2dnZXJ2amp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDM0OTUsImV4cCI6MjA2OTQxOTQ5NX0.Mq_xKZQgachZLHeKLyIc76b7Xef55R7-eMnzfSTwQbQ';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Referencias al DOM
const tabla = document.querySelector('#tablaRegistros tbody');
const botonNuevo = document.getElementById('nuevoRegistro');

// Cargar registros al iniciar
document.addEventListener('DOMContentLoaded', async () => {
  await cargarRegistros();
});

// Función para cargar registros desde Supabase
async function cargarRegistros() {
  const { data, error } = await supabase.from('registros_qr').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Error al cargar registros:', error.message);
    return;
  }

  tabla.innerHTML = '';
  data.forEach(registro => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${registro.id}</td>
      <td>${registro.proveedor || ''}</td>
      <td>${registro.usuario || ''}</td>
      <td>${registro.contenido || ''}</td>
      <td>${registro.cantidad || ''}</td>
      <td>${registro.edificio || ''}</td>
      <td>${registro.localizacion || ''}</td>
      <td>${registro.contrato || ''}</td>
      <td>${registro.fecha_entrada || ''}</td>
      <td>${registro.fecha_salida || ''}</td>
      <td>${registro.observaciones || ''}</td>
      <td>${registro.estatus || ''}</td>
      <td>
        <button onclick="descargarQR(${registro.id})">Descargar QR</button>
        <button onclick="modificarRegistro(${registro.id})">Modificar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Función para crear un nuevo registro con ID consecutivo
botonNuevo.addEventListener('click', async () => {
  const { data: ultimo, error } = await supabase
    .from('registros_qr')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  const nuevoId = ultimo.length > 0 ? ultimo[0].id + 1 : 1;

  const { error: insertError } = await supabase.from('registros_qr').insert([{ id: nuevoId }]);
  if (insertError) {
    alert('Error al crear nuevo registro');
    return;
  }

  await cargarRegistros();
  alert('Nuevo registro creado con ID: ' + nuevoId);
});

// Función para descargar el QR
function descargarQR(id) {
  const qr = new QRious({
    value: window.location.origin + '/qr/' + id,
    size: 200
  });

  const enlace = document.createElement('a');
  enlace.href = qr.toDataURL();
  enlace.download = 'qr_' + id + '.png';
  enlace.click();
}

// Función placeholder para modificar
function modificarRegistro(id) {
  alert('Funcionalidad de modificación aún no implementada para ID: ' + id);
}
