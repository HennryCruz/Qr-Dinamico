
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
  const vista = document.getElementById('vista');

  if (!data.proveedor && !data.contenido && !data.edificio && !data.contrato && !data.observaciones) {
    formulario.style.display = 'block';
    vista.style.display = 'none';
  } else {
    formulario.style.display = 'block';
    vista.style.display = 'none';
  }

  for (const campo in data) {
    const input = document.querySelector(`[name="${campo}"]`);
    if (input) input.value = data[campo] || '';
  }
}

async function guardarCambios() {
  const campos = [
    'proveedor', 'usuario', 'contenido', 'cantidad', 'edificio',
    'localizacion', 'contrato', 'fecha_entrada', 'fecha_salida',
    'observaciones', 'estatus'
  ];

  const datos = {};
  campos.forEach(campo => {
    const valor = document.querySelector(`[name="${campo}"]`).value;
    datos[campo] = valor;
  });

  // Condición: si estatus no es "devolucion", permitir fecha_salida vacía
  if (datos.estatus.toLowerCase() !== 'devolucion') {
    datos.fecha_salida = datos.fecha_salida || null;
  }

  const { error } = await supabase.from('registros_qr').update(datos).eq('id', id);
  if (error) {
    console.error('Error al guardar cambios:', error);
    alert('No se pudieron guardar los cambios.');
  } else {
    alert('Cambios guardados correctamente.');
  }
}

window.addEventListener('DOMContentLoaded', cargarDetalle);
