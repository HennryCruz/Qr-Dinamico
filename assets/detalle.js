const supabase = window.supabase.createClient(
  'https://fbmdevivfhesggervjjy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibWRldml2Zmhlc2dnZXJ2amp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDM0OTUsImV4cCI6MjA2OTQxOTQ5NX0.Mq_xKZQgachZLHeKLyIc76b7Xef55R7-eMnzfSTwQbQ'
);

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function cargarDetalle() {
  const { data, error } = await supabase.from('registros_qr').select('*').eq('id', id).single();
  const container = document.getElementById('formulario-container');
  if (error || !data) {
    container.innerHTML = '<p>Error al cargar el registro.</p>';
    return;
  }

  if (!data.proveedor && !data.contenido && !data.edificio && !data.contrato && !data.observaciones) {
    // Mostrar formulario para llenar
    container.innerHTML = `
      <form id="formulario">
        <input name="proveedor" placeholder="Proveedor" required />
        <input name="usuario" placeholder="Usuario" required />
        <input name="contenido" placeholder="Contenido" required />
        <input name="cantidad" type="number" placeholder="Cantidad" required />
        <input name="edificio" placeholder="Edificio" required />
        <input name="localizacion" placeholder="Localización" required />
        <input name="contrato" placeholder="Contrato" required />
        <input name="fecha_entrada" type="date" placeholder="Fecha Entrada" required />
        <textarea name="observaciones" placeholder="Observaciones"></textarea>
        <select name="estatus">
          <option value="entregado">Entregado</option>
          <option value="devolucion">Devuelto</option>
        </select>
        <button type="submit">Guardar</button>
      </form>
    `;
    document.getElementById('formulario').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const campos = Object.fromEntries(new FormData(form).entries());
      const { error } = await supabase.from('registros_qr').update(campos).eq('id', id);
      if (error) {
        alert('Error al guardar');
      } else {
        alert('Datos guardados');
        location.reload();
      }
    });
  } else {
    // Mostrar solo ciertos campos
    container.innerHTML = `
      <p><strong>Proveedor:</strong> ${data.proveedor}</p>
      <p><strong>Contenido:</strong> ${data.contenido}</p>
      <p><strong>Edificio:</strong> ${data.edificio}</p>
      <p><strong>Contrato:</strong> ${data.contrato}</p>
      <p><strong>Observaciones:</strong> ${data.observaciones}</p>
    `;
  }
}

cargarDetalle();