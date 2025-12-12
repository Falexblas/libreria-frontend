import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

/**
 * Composable para generar facturas en PDF
 */
export function useFactura() {
  const authStore = useAuthStore()

  /**
   * Formatear fecha para mostrar en la factura
   */
  function formatearFecha(fecha) {
    if (!fecha) return 'N/A'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Descargar factura en PDF
   * @param {Number} pedidoId - ID del pedido
   */
  async function descargarFactura(pedidoId) {
    try {
      // Mostrar loading
      Swal.fire({
        title: 'Generando factura...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      // Obtener datos de la factura desde el backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://libreria-backend-oebo.onrender.com'}/api/ordenes/${pedidoId}/factura`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener datos de la factura')
      }

      const factura = await response.json()

      // Crear documento PDF
      const doc = new jsPDF()

      // ========================================
      // ENCABEZADO
      // ========================================
      
      // Logo o nombre de la empresa (centrado)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('MUNDO DE PAPEL', 105, 20, { align: 'center' })
      
      // Información de la empresa
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(factura.razonSocialEmpresa || 'Mundo De Papel S.A.C.', 105, 28, { align: 'center' })
      doc.text(`RUC: ${factura.rucEmpresa || '20123456789'}`, 105, 34, { align: 'center' })
      doc.text(factura.direccionEmpresa || 'Av. Principal 123, Lima, Perú', 105, 40, { align: 'center' })

      // Línea separadora
      doc.setLineWidth(0.5)
      doc.line(20, 45, 190, 45)

      // ========================================
      // INFORMACIÓN DE LA FACTURA
      // ========================================
      
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('FACTURA ELECTRÓNICA', 105, 55, { align: 'center' })
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`N°: ${factura.numeroFactura}`, 20, 65)
      doc.text(`Fecha: ${formatearFecha(factura.fecha)}`, 20, 72)

      // ========================================
      // DATOS DEL CLIENTE
      // ========================================
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('DATOS DEL CLIENTE:', 20, 85)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Cliente: ${factura.cliente.nombre} ${factura.cliente.apellido || ''}`, 20, 92)
      doc.text(`DNI: ${factura.cliente.dni || 'N/A'}`, 20, 99)
      doc.text(`Email: ${factura.cliente.email}`, 20, 106)
      doc.text(`Dirección: ${factura.direccion}`, 20, 113)
      doc.text(`Ciudad: ${factura.ciudad} - CP: ${factura.codigoPostal}`, 20, 120)
      if (factura.telefono) {
        doc.text(`Teléfono: ${factura.telefono}`, 20, 127)
      }

      // ========================================
      // TABLA DE PRODUCTOS
      // ========================================
      
      const startY = factura.telefono ? 135 : 128

      // Generar tabla de productos
      const tableData = factura.detalles.map(detalle => [
        detalle.libro.titulo,
        `${detalle.libro.autorNombre} ${detalle.libro.autorApellido}`,
        detalle.cantidad,
        `S/ ${detalle.precioUnitario.toFixed(2)}`,
        `S/ ${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}`
      ])

      autoTable(doc, {
        startY: startY,
        head: [['Producto', 'Autor', 'Cantidad', 'P. Unitario', 'Subtotal']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [13, 110, 253], // Color azul Bootstrap
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 60 },  // Producto
          1: { cellWidth: 50 },  // Autor
          2: { halign: 'center', cellWidth: 20 },  // Cantidad
          3: { halign: 'right', cellWidth: 30 },   // P. Unitario
          4: { halign: 'right', cellWidth: 30 }    // Subtotal
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        didDrawPage: function (data) {
          // Esta función se ejecuta después de dibujar la tabla
        }
      })

      // ========================================
      // TOTALES
      // ========================================
      
      // Obtener la posición Y final de la tabla
      let finalY = startY + 50 // Valor por defecto
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        finalY = doc.lastAutoTable.finalY + 10
      } else if (doc.previousAutoTable && doc.previousAutoTable.finalY) {
        finalY = doc.previousAutoTable.finalY + 10
      }

      // Cuadro de totales
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.1)
      doc.rect(130, finalY, 60, 30)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Subtotal:', 135, finalY + 8)
      doc.text(`S/ ${factura.subtotal.toFixed(2)}`, 185, finalY + 8, { align: 'right' })

      doc.text('IGV (18%):', 135, finalY + 16)
      doc.text(`S/ ${factura.igv.toFixed(2)}`, 185, finalY + 16, { align: 'right' })

      // Total en negrita
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text('TOTAL:', 135, finalY + 25)
      doc.text(`S/ ${factura.total.toFixed(2)}`, 185, finalY + 25, { align: 'right' })

      // ========================================
      // INFORMACIÓN ADICIONAL
      // ========================================
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`Método de pago: ${formatearMetodoPago(factura.metodoPago)}`, 20, finalY + 45)

      // ========================================
      // PIE DE PÁGINA
      // ========================================
      
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('¡Gracias por su compra!', 105, 280, { align: 'center' })
    

      // ========================================
      // GUARDAR PDF
      // ========================================
      
      doc.save(`factura-${factura.numeroFactura}.pdf`)

      // Cerrar loading y mostrar éxito
      Swal.fire({
        icon: 'success',
        title: '¡Factura descargada!',
        text: `Factura ${factura.numeroFactura} descargada exitosamente`,
        timer: 2000,
        showConfirmButton: false
      })

    } catch (error) {
      console.error('Error al generar factura:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar la factura. Intenta nuevamente.',
        confirmButtonText: 'OK'
      })
    }
  }

  /**
   * Formatear método de pago
   */
  function formatearMetodoPago(metodo) {
    const metodos = {
      'tarjeta': 'Tarjeta de crédito/débito',
      'yape': 'Yape',
      'plin': 'Plin'
    }
    return metodos[metodo] || metodo
  }

  return {
    descargarFactura
  }
}
