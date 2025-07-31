const supabaseUrl = "https://fbmdevivfhesggervjjy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibWRldml2Zmhlc2dnZXJ2amp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDM0OTUsImV4cCI6MjA2OTQxOTQ5NX0.Mq_xKZQgachZLHeKLyIc76b7Xef55R7-eMnzfSTwQbQ";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabase.from("registros_qr").select("*").order("id", { ascending: true });
  if (error) return console.error("Error al cargar datos:", error);
  const tbody = document.querySelector("#tablaRegistros tbody");
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.id}</td><td>${row.proveedor}</td><td>${row.usuario}</td><td>${row.contenido}</td>
      <td>${row.cantidad}</td><td>${row.edificio}</td><td>${row.localizacion}</td><td>${row.contrato}</td>
      <td>${row.fecha_entrada}</td><td>${row.fecha_salida || ""}</td><td>${row.observaciones}</td><td>${row.estatus}</td>
      <td>
        <button onclick="descargarQR(${row.id})">Descargar QR</button>
        <button onclick="modificarRegistro(${row.id})">Modificar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
});

document.getElementById("nuevoRegistro").addEventListener("click", async () => {
  const { data, error } = await supabase.from("registros_qr").insert([{ proveedor: "", usuario: "", contenido: "" }]).select();
  if (error) return alert("Error al crear nuevo registro");
  alert("Nuevo registro creado con ID: " + data[0].id);
  location.reload();
});

function descargarQR(id) {
  const qr = new QRious({ value: window.location.origin + "/qr/" + id, size: 200 });
  const a = document.createElement("a");
  a.href = qr.toDataURL();
  a.download = "qr_" + id + ".png";
  a.click();
}

function modificarRegistro(id) {
  alert("Función de modificación aún no implementada para ID: " + id);
}
