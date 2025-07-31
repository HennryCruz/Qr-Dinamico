const supabaseUrl = 'https://fbmdevivfhesggervjjy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibWRldml2Zmhlc2dnZXJ2amp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDM0OTUsImV4cCI6MjA2OTQxOTQ5NX0.Mq_xKZQgachZLHeKLyIc76b7Xef55R7-eMnzfSTwQbQ';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function cargarRegistros() {
  const { data, error } = await supabase.from('registros_qr').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Error al cargar datos:', error);
    return;
  }
  const tabla = document.getElementById('tabla-registros');
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
        <a href="detalle.html?id=${registro.id}" class="button">Modificar</a>
        <button onclick="descargarQR(${registro.id})">Descargar QR</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

async function crearNuevoRegistro() {
  const { data: ultimo } = await supabase.from('registros_qr').select('id').order('id', { ascending: false }).limit(1);
  const nuevoId = ultimo && ultimo.length ? ultimo[0].id + 1 : 1;
  const { error } = await supabase.from('registros_qr').insert([{ id: nuevoId }]);
  if (error) {
    console.error('Error al crear nuevo registro:', error);
    alert('No se pudo crear el nuevo registro.');
    return;
  }
  alert(`Registro creado con ID ${nuevoId}. Puedes escanear el QR para llenarlo.`);
  cargarRegistros();
}

function descargarQR(id) {
  const qrTemp = document.createElement('div');
  new QRCode(qrTemp, {
    text: `${window.location.origin}/detalle.html?id=${id}`,
    width: 200,
    height: 200
  });
  setTimeout(() => {
    const img = qrTemp.querySelector('img');
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `QR_${id}.png`;
    link.click();
  }, 1000);
}

if (document.getElementById('tabla-registros')) {
  window.addEventListener('DOMContentLoaded', cargarRegistros);
}