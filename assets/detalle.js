const supabaseUrl = 'https://fbmdevivfhesggervjjy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibWRldml2Zmhlc2dnZXJ2amp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDM0OTUsImV4cCI6MjA2OTQxOTQ5NX0.Mq_xKZQgachZLHeKLyIc76b7Xef55R7-eMnzfSTwQbQ';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function cargarDetalle() {
  const { data, error } = await supabase.from('registros_qr').select('*').eq('id', id).single();
  if (error || !data) {
    console.error('Error al cargar el registro:', error);
    return;
  }

  const formulario = document.getElementById('formulario');
  const vistaDatos = document.getElementById('vista-datos');
  const campoFechaSalida = document.querySelector('[name="fecha_salida"]').parentElement;

  // Mostrar formulario si faltan datos obligatorios
  if (!data.proveedor && !data.contenido && !data.edificio && !data.contrato && !data.observaciones) {
    formulario.style.display = 'block';
    vistaDatos.style.display = 'none';
  } else {
    // Mostrar solo vista con campos seleccionados
    formulario.style.display = 'none';
    vistaDatos.style.display = 'block';
    vistaDatos.innerHTML = `
      <div><strong>Proveedor:</strong> ${data.proveedor || ''}</div>
      <div><strong>Usuario:</strong> ${data.usuario || ''}</div>
      <div><strong>Contenido:</strong> ${data.contenido || ''}</div>
      <div><strong>Contrato:</strong> ${data.contrato || ''}</div>
      <div><strong>Fecha de Entrada:</strong> ${data.fecha_entrada || ''}</div>
      <div><strong>Observaciones:</strong> ${data.observaciones || ''}</div>
    `;
    return;
  }

  // Llenar campos del formulario
  for (const campo in data) {
    const input = document.querySelector(`[name="${campo}"]`);
    if (input) input.value = data[campo] || '';
  }

  // Mostrar/ocultar campo fecha_salida según estatus
  const estatusSelect = document.querySelector('[name="estatus"]');
  function toggleFechaSalida() {
    if (estatusSelect.value === 'devolucion') {
      campoFechaSalida.style.display = '';
    } else {
      campoFechaSalida.style.display = 'none';
      document.querySelector('[name="fecha_salida"]').value = '';
    }
  }
  estatusSelect.addEventListener('change', toggleFechaSalida);
  toggleFechaSalida();
}

async function guardarCambios(e) {
  e.preventDefault();
  const campos = [
    'proveedor', 'usuario', 'contenido', 'cantidad', 'edificio',
    'localizacion', 'contrato', 'fecha_entrada', 'fecha_salida',
    'observaciones', 'estatus'
  ];

  const datos = {};
  campos.forEach(campo => {
    const input = document.querySelector(`[name="${campo}"]`);
    datos[campo] = input ? input.value : null;
  });

  // Si estatus es distinto de "devolucion", limpiar fecha_salida
  if (datos.estatus !== 'devolucion') {
    datos.fecha_salida = null;
  }

  const { error } = await supabase.from('registros_qr').update(datos).eq('id', id);
  if (error) {
    console.error('Error al guardar cambios:', error);
    alert('No se pudieron guardar los cambios.');
  } else {
    alert('Cambios guardados correctamente.');
    window.location.href = 'index.html';
  }
}

window.addEventListener('DOMContentLoaded', cargarDetalle);
document.getElementById('formulario').addEventListener('submit', guardarCambios);
