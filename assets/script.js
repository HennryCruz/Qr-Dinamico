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
      <td>${registro.no_serie || ''}</td>
      <td class="observaciones">${registro.observaciones || ''}</td>
      <td>${registro.estatus || ''}</td>
      <td class="acciones">
        <div class="acciones-fila">
          <button class="icon-btn" title="Modificar" onclick="location.href='detalle.html?id=${registro.id}&edit=1'">✍</button>
          <button class="icon-btn" title="Descargar QR" onclick="descargarQR(${registro.id})">📥</button>
          <button class="icon-btn" title="Eliminar" onclick="eliminarRegistro(${registro.id})">🗑️</button>
        </div>
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
  alert(`Registro creado con No° ID ${nuevoId}.`);
  cargarRegistros();
}

async function eliminarRegistro(id) {
  if (!confirm(`¿Seguro que deseas eliminar el registro con ID ${id}?`)) return;
  const { error } = await supabase.from('registros_qr').delete().eq('id', id);
  if (error) {
    alert('No se pudo eliminar el registro.');
    console.error(error);
  } else {
    alert('Registro eliminado correctamente.');
    cargarRegistros();
  }
}

function descargarQR(id) {
  const qrCode = new QRCodeStyling({
    width: 220,
    height: 220,
    data: `${window.location.origin}/detalle.html?id=${id}`,
    image: "assets/titulo.png",
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 4,
      imageSize: 0.25,
    },
    dotsOptions: {
      color: "#222",
      type: "rounded"
    },
    backgroundOptions: {
      color: "#fff",
    }
  });

  const tempDiv = document.createElement('div');
  document.body.appendChild(tempDiv);
  qrCode.append(tempDiv);

  setTimeout(async () => {
    const qrBlob = await qrCode.getRawData("png");
    const qrUrl = URL.createObjectURL(qrBlob);

    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new window.Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0, 220, 220);
      ctx.font = "bold 18px Segoe UI, Arial";
      ctx.fillStyle = "#222";
      ctx.textAlign = "center";
      ctx.fillText(`ID: ${id}`, canvas.width / 2, 250);

      const link = document.createElement('a');
      link.href = canvas.toDataURL("image/png");
      link.download = `QR_${id}.png`;
      link.click();

      tempDiv.remove();
      URL.revokeObjectURL(qrUrl);
    };
    img.src = qrUrl;
  }, 800);
}

// 🔍 FILTRO EN TIEMPO REAL
document.addEventListener("DOMContentLoaded", () => {
  const inputBusqueda = document.getElementById("busqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", function () {
      const filtro = this.value.toLowerCase();
      const filas = document.querySelectorAll("#tabla-registros tr");
      filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(filtro) ? "" : "none";
      });
    });
  }

  cargarRegistros(); // inicializa la tabla al cargar
});

// 📥 EXPORTAR A EXCEL
function exportarAExcel() {
  const tabla = document.querySelector("table");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(tabla);
  XLSX.utils.book_append_sheet(wb, ws, "Cilindros");
  XLSX.writeFile(wb, "tabla_cilindros.xlsx");
}
