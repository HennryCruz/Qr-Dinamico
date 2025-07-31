const supabaseUrl = 'https://fbmdevivfhesggervjjy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibWRldml2Zmhlc2dnZXJ2amp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDM0OTUsImV4cCI6MjA2OTQxOTQ5NX0.Mq_xKZQgachZLHeKLyIc76b7Xef55R7-eMnzfSTwQbQ';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const formulario = document.getElementById('formulario');
const vista = document.getElementById('vista-datos');

async function cargarRegistro() {
  const { data, error } = await supabase.from('registros_qr').select('*').eq('id', id).single();
  if (error) {
    console.error('Error al cargar registro:', error);
    return;
  }

  if (!data || (!data.usuario && !data.proveedor && !data.contenido)) {
    formulario.style.display = 'block';
    vista.style.display = 'none';
  } else {
    formulario.style.display = 'block';
    vista.style.display = 'none';
    for (const campo in data) {
      const input = formulario.elements[campo];
      if (input) input.value = data[campo];
    }
  }
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  const campos = Object.fromEntries(new FormData(formulario).entries());
  const { error } = await supabase.from('registros_qr').update(campos).eq('id', id);
  if (error) {
    alert('Error al guardar');
  } else {
    alert('Datos guardados correctamente');
    location.reload();
  }
});

cargarRegistro();
