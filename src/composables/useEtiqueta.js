import jsPDF from 'jspdf'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
import logoPath from '@/assets/logo.png'

/**
 * Composable para generar etiquetas de envío en PDF
 */
export function useEtiqueta() {
  const authStore = useAuthStore()

  function capitalizeWords(str) {
    if (!str) return ''
    return str
      .toString()
      .toLowerCase()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Capitaliza solo la primera letra de la cadena y deja el resto en minúsculas
  function capitalizeLabel(str) {
    if (!str) return ''
    const s = str.toString().toLowerCase()
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  async function generarEtiqueta(pedidoId) {
    try {
      Swal.fire({
        title: 'Generando etiqueta...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      })

      // Obtener datos de la orden
      const res = await fetch(`http://localhost:8080/api/empleado/ordenes/${pedidoId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })

      if (!res.ok) {
        throw new Error('No se pudo obtener la orden')
      }

      const orden = await res.json()

      // Intentar obtener datos adicionales de factura
      let factura = null
      try {
        const respFac = await fetch(`http://localhost:8080/api/ordenes/${pedidoId}/factura`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        if (respFac.ok) factura = await respFac.json()
      } catch (e) {
        // no crítico
      }

      // Crear PDF (A6 landscape para etiqueta horizontal)
      const doc = new jsPDF({ 
        unit: 'mm', 
        format: 'a6',
        orientation: 'landscape'
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 6
      let y = margin + 2

      // Cargar logo
      let logoData = null
      try {
        const r = await fetch(logoPath)
        const b = await r.blob()
        logoData = await new Promise((resolve) => {
          const fr = new FileReader()
          fr.onload = () => resolve(fr.result)
          fr.readAsDataURL(b)
        })
      } catch (e) {
        // no crítico
      }

      // ========== BORDE EXTERIOR ==========
      doc.setDrawColor(0)
      doc.setLineWidth(0.6)
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)

      // ========== SECCIÓN 1: HEADER CON LOGO Y EMPRESA ==========
      const headerHeight = 20
      
      // Recuadro del header
      doc.setFillColor(255, 255, 255)
      doc.rect(margin, margin, pageWidth - margin * 2, headerHeight)
      
      // Logo en la izquierda
      if (logoData) {
        doc.addImage(logoData, 'PNG', margin + 3, y, 35, 16)
      }

      // Datos de la empresa a la derecha del logo
      const empresaX = margin + 42
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      const empresaNombre = (orden.empresaNombre || factura?.razonSocialEmpresa) || 'MUNDO DE PAPEL S.A.C.'
      doc.text(empresaNombre, empresaX, y + 5)
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const empresaDir = factura?.direccionEmpresa || 'Av. Principal 123, Lima, Perú'
      doc.text(empresaDir, empresaX, y + 10)
      
      const empresaRuc = factura?.rucEmpresa || orden.rucEmpresa || '20123456789'
      doc.text(`RUC: ${empresaRuc}`, empresaX, y + 15)

      // Línea separadora (más delgada)
      y = margin + headerHeight
      doc.setLineWidth(0.6)
      doc.line(margin, y, pageWidth - margin, y)

      // ========== SECCIÓN 2: DESTINATARIO ==========
      y += 6
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('DESTINATARIO:', margin + 3, y)
      y += 5

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const nombre = ((orden.usuario?.nombre || orden.cliente?.nombre || '') + ' ' + 
             (orden.usuario?.apellido || orden.cliente?.apellido || '')).trim()
      doc.text(`Nombre: ${nombre ? capitalizeWords(nombre) : 'Nombre destinatario'}`, margin + 3, y)
      y += 5

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      // Dirección (no mostrar referencia dentro de la dirección)
      // Dirección original (mantener referencia dentro de la dirección)
      const direccionRaw = (orden.direccionEnvio || orden.direccion || factura?.direccion || 'CALLE LOS PINOS 567, DPTO 3B').toString().trim()
      const referenciaCandidate = (orden.referencia || orden.referencias || factura?.referencia || '').toString().trim()
      const direccionPrint = direccionRaw
      doc.text(`${capitalizeLabel('DIRECCIÓN')}: ${capitalizeWords(direccionPrint)}`, margin + 3, y)
      y += 5

      const ciudad = (orden.ciudadEnvio || orden.ciudad || factura?.ciudad || 'LIMA').toUpperCase()
      // Evitar imprimir la ciudad si ya aparece dentro de la dirección (previene duplicados)
      if (!direccionPrint.toUpperCase().includes(ciudad)) {
        doc.text(`${capitalizeWords(ciudad)}`, margin + 3, y)
        y += 5
      }

      const telefono = orden.telefonoContacto || orden.telefono || factura?.telefono || ''
      if (telefono) {
        doc.text(`${capitalizeLabel('CELULAR')}: ${telefono}`, margin + 3, y)
        y += 5
      }

      // Nota: la referencia ya se muestra sobre la sección de ciudad si existe

      // Línea separadora (más delgada)
      y += 2
      doc.setLineWidth(0.6)
      doc.line(margin, y, pageWidth - margin, y)

      // ========== SECCIÓN 3: INFORMACIÓN DEL PEDIDO ==========
      y += 6
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('INFORMACIÓN DEL PEDIDO:', margin + 3, y)
      y += 5

      const numeroPedido = factura?.numeroFactura || `C${String(orden.id).padStart(10, '0')}`
      doc.setFont('helvetica', 'normal')
      doc.text(`${capitalizeLabel('NÚMERO DE PEDIDO')}: ${numeroPedido}`, margin + 3, y)
      y += 5

      const servicio = (factura?.servicio || orden.servicio || 'envío regular lima')
      doc.text(`${capitalizeLabel('SERVICIO')}: ${capitalizeWords(servicio)}`, margin + 3, y)
      y += 8

      // ========== CÓDIGO DE BARRAS ==========
      // Resolver número de seguimiento probando varios campos comunes en factura y orden
      const tracking = (
        factura?.numeroSeguimiento ||
        factura?.trackingNumber ||
        factura?.numero_seguimiento ||
        factura?.tracking ||
        factura?.seguimiento ||
        orden?.numeroSeguimiento ||
        orden?.trackingNumber ||
        orden?.tracking ||
        orden?.numero_seguimiento ||
        // fallback: generar un código basado en ID similar a otras vistas
        `PE${String(orden.id).padStart(5, '0')}${Date.now().toString().slice(-6)}`
      )
      
      const barcodeX = margin + 3
      const barcodeY = y
      const barcodeW = pageWidth - margin * 2 - 6
      // Ajustar altura del barcode para que quepa en la página
      let barcodeH = 18
      const availableBelow = pageHeight - barcodeY - margin - 20
      if (availableBelow < barcodeH + 20) {
        // reducir barcode si falta espacio
        barcodeH = Math.max(8, availableBelow - 10)
      }

      // Fondo blanco del código de barras
      doc.setFillColor(255, 255, 255)
      doc.rect(barcodeX, barcodeY, barcodeW, barcodeH, 'F')
      
      // Dibujar líneas del código de barras
      doc.setDrawColor(0)
      let pos = barcodeX + 2
      const seed = tracking || ''
      
      for (let i = 0; i < 80; i++) {
        const ch = seed.charCodeAt(i % seed.length) || (i * 37 % 128)
        const w = ((ch % 4) + 1) * 0.4
        const h = barcodeH - 4
        doc.setLineWidth(w)
        doc.line(pos, barcodeY + 2, pos, barcodeY + h + 2)
        pos += w + 0.3
        if (pos > barcodeX + barcodeW - 2) break
      }

      // Número de seguimiento debajo del código de barras
      y = barcodeY + barcodeH + 6
      // Asegurar que el número de seguimiento quede dentro del área imprimible
      const maxYForText = pageHeight - margin - 12
      if (y > maxYForText) {
        // intentar moverlo justo encima del footer
        y = maxYForText
      }
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      // Forzar que el texto de tracking se ajuste en ancho
      const trackingText = `${capitalizeLabel('NÚMERO DE SEGUIMIENTO')}: ${tracking}`
      const trackingLines = doc.splitTextToSize(trackingText, pageWidth - margin * 2 - 6)
      doc.text(trackingLines, margin + 3, y)
      y += 5

      // Transportista
      const transportista = factura?.transportista || orden.transportista || 'Logisticas S.A.C.'
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(`Transportista: ${transportista.toUpperCase()}`, margin + 3, y)

      // Guardar PDF
      doc.save(`etiqueta-pedido-${orden.id}.pdf`)

      Swal.close()
      Swal.fire({ 
        icon: 'success', 
        title: 'Etiqueta generada', 
        timer: 1500, 
        showConfirmButton: false 
      })
    } catch (error) {
      console.error('Error al generar etiqueta:', error)
      Swal.close()
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: 'No se pudo generar la etiqueta' 
      })
    }
  }

  return { generarEtiqueta }
}