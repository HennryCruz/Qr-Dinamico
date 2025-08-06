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
      <td>${registro.observaciones || ''}</td>
      <td>${registro.estatus || ''}</td>
      <td>
        <a href="detalle.html?id=${registro.id}&edit=1" class="button">Modificar</a>
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
  alert(`Registro creado con No° ID ${nuevoId}.`);
  cargarRegistros();
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

  // Crear un contenedor temporal
  const tempDiv = document.createElement('div');
  document.body.appendChild(tempDiv);

  qrCode.append(tempDiv);

  setTimeout(async () => {
    const qrBlob = await qrCode.getRawData("png");
    const qrUrl = URL.createObjectURL(qrBlob);

    // Crear canvas para agregar texto debajo
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 270; // Más alto para el texto
    const ctx = canvas.getContext('2d');

    // Limpiar el canvas antes de dibujar
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cargar la imagen QR
    const img = new window.Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0, 220, 220);
      ctx.font = "bold 18px Segoe UI, Arial";
      ctx.fillStyle = "#222";
      ctx.textAlign = "center";
      // Dibuja el texto bien centrado y separado del QR
      ctx.fillText(`ID: ${id}`, canvas.width / 2, 250); // Y=250 es debajo del QR
      // Descargar el canvas como imagen
      const link = document.createElement('a');
      link.href = canvas.toDataURL("image/png");
      link.download = `QR_${id}.png`;
      link.click();

      // Limpieza
      tempDiv.remove();
      URL.revokeObjectURL(qrUrl);
    };
    img.src = qrUrl;
  }, 800);
}

if (document.getElementById('tabla-registros')) {
  window.addEventListener('DOMContentLoaded', cargarRegistros);
}
