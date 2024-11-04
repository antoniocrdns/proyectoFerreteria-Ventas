import { jsPDF } from 'jspdf';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

/**
 * Genera un PDF en formato de ticket y lo guarda en el sistema de archivos (móvil) o descarga en la web.
 * @param {Object} ticketData - Los datos del ticket que incluyen el total y una lista de productos.
 * @param {number} ticketData.total - El total de la compra.
 * @param {Array} ticketData.productos - Lista de productos en el ticket.
 */
const generateTicketPDF = async (ticketData) => {
    const { productos, total } = ticketData;
    const IVA_TASA = 0.08; // 8%

    const IVA = (total * IVA_TASA) / (1 + IVA_TASA);
    const subtotal = total - IVA;

    const doc = new jsPDF();

    // Título del ticket
    doc.setFontSize(18);
    doc.text('Ticket de Compra', 20, 20);

    // Detalles de los productos
    let yPosition = 40;
    productos.forEach((producto, index) => {
        doc.setFontSize(10);
        doc.text(`Producto ${index + 1}: ${producto.nombre || 'N/A'}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Cantidad: ${producto.cantidad}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Precio unitario: $${producto.precio_unitario.toFixed(2)}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Subtotal: $${(producto.cantidad * producto.precio_unitario).toFixed(2)}`, 20, yPosition);
        yPosition += 10; // Espacio entre productos
    });

    // Subtotal, IVA
    doc.setFontSize(12);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 20, yPosition);
    yPosition += 6;
    doc.text(`IVA (8%): $${IVA.toFixed(2)}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Total: $${total.toFixed(2)}`, 20, yPosition);

    if (Platform.OS === 'web') {
        doc.save(`ticket_${Date.now()}.pdf`);
        alert('PDF Generado: El ticket se ha descargado.');
    } else {
        const pdfOutput = doc.output('datauristring').split(',')[1];
        const path = `${FileSystem.documentDirectory}ticket_${Date.now()}.pdf`;
        await FileSystem.writeAsStringAsync(path, pdfOutput, { encoding: FileSystem.EncodingType.Base64 });

        Alert.alert('PDF Generado', `El ticket se ha guardado en: ${path}`);
    }
};

export default generateTicketPDF;
