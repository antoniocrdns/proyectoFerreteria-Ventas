import { jsPDF } from 'jspdf';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const generateTicketPDF = async (ticketData) => {
    const { productos, total } = ticketData;
    const IVA_TASA = 0.08; // 8%

    const IVA = (total * IVA_TASA) / (1 + IVA_TASA);
    const subtotal = total - IVA;

    const doc = new jsPDF();

    // Título del ticket con líneas separadoras
    doc.setFontSize(18);
    doc.text('Ticket de Compra', 20, 20);
    doc.line(10, 25, 200, 25); // Línea debajo del título

    // Detalles de los productos
    let yPosition = 35;
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

    // Línea debajo de la lista de productos
    doc.line(10, yPosition - 4, 200, yPosition - 4);
    yPosition += 6;

    // Subtotal, IVA y Total
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
