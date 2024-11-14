import * as React from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import generateTicketPDF from '../utils/generateTicketPDF';

const Venta = () => {
    const [productId, setProductId] = React.useState('');
    const [products, setProducts] = React.useState([]);
    const IVA_RATE = 0.08;

    const getProductById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/productos/${id}`);
            const product = response.data;

            if (product.activo !== 1 || product.cantidad <= 0) {
                alert('Error: Producto inactivo o sin stock disponible');
                return null;
            }
            return product;
        } catch (error) {
            alert('Error: Producto no encontrado');
            console.log(error.response?.data?.message)
            return null;
        }
    };

    const addProduct = async () => {
        if (productId) {
            const existingProduct = products.find(p => p.producto_id === productId);
            if (existingProduct) {
                const product = await getProductById(productId);
                if (product && existingProduct.cantidad + 1 > product.cantidad) {
                    alert('Error: No hay suficiente inventario para agregar más de este producto.');
                    return;
                }
                setProducts(products.map(p =>
                    p.producto_id === productId
                        ? { ...p, cantidad: p.cantidad + 1 }
                        : p
                ));
            } else {
                const product = await getProductById(productId);
                if (product) {
                    setProducts([...products, {
                        producto_id: product.id,
                        nombre: product.nombre,
                        cantidad: 1,
                        precio_unitario: product.precio,
                        inventario: product.cantidad
                    }]);
                }
            }
            setProductId('');
        } else {
            alert('Error: Por favor ingrese un ID de producto válido');
        }
    };

    const removeProduct = (id) => {
        setProducts(products.filter(p => p.producto_id !== id));
    };

    const updateQuantity = async (id, increment) => {
        const productToUpdate = products.find(p => p.producto_id === id);

        if (productToUpdate) {
            const newQuantity = productToUpdate.cantidad + increment;
            if (newQuantity < 0) {
                alert('Error: No se puede tener una cantidad negativa.');
                return;
            }
            if (newQuantity > productToUpdate.inventario) {
                alert('Error: No hay suficiente inventario para esta cantidad.');
                return;
            }
            setProducts(products.map(p =>
                p.producto_id === id
                    ? { ...p, cantidad: newQuantity }
                    : p
            ));
        }
    };

    const calculateTotals = () => {
        const subtotal = products.reduce((sum, p) => sum + p.cantidad * p.precio_unitario, 0);
        const iva = subtotal * IVA_RATE;
        const total = subtotal + iva;
        return { subtotal, iva, total };
    };

    const { subtotal, iva, total } = calculateTotals();

    const handleCreateTicket = async () => {
        const ticketData = {
            total: parseFloat(total.toFixed(2)),
            productos: products.map(p => ({
                producto_id: p.producto_id,
                cantidad: p.cantidad,
                precio_unitario: parseFloat(p.precio_unitario.toFixed(2)),
                nombre: p.nombre
            })),
        };

        try {
            const response = await axios.post('http://127.0.0.1:3000/api/tickets', ticketData);
            const ticketId = response.data.ticket_id;

            await generateTicketPDF(ticketData); // Generar PDF 

            alert(`Ticket creado exitosamente con ID: ${ticketId}`);

            setProducts([]);
            setProductId('');
        } catch (error) {
            alert('Error: Hubo un problema al crear el ticket. Inténtalo de nuevo.');
            console.log(error.response?.data?.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Producto</Text>
            <TextInput
                placeholder="ID de producto"
                value={productId}
                onChangeText={setProductId}
                style={styles.input}
            />
            <Button  title="Añadir Producto" onPress={addProduct} color="#d17609"  />

            <FlatList
                data={products}
                keyExtractor={item => item.producto_id}
                renderItem={({ item }) => (
                    <View style={styles.productRow}>
                        <Text style={styles.TextP}>{item.producto_id} | {item.nombre}</Text>
                        <Text style={styles.TextP}>Precio: ${item.precio_unitario.toFixed(2)}</Text>
                        <Text style={styles.TextP}>Cantidad: {item.cantidad}</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity onPress={() => updateQuantity(item.producto_id, 1)}>
                                <Text style={styles.quantityButton}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => updateQuantity(item.producto_id, -1)}>
                                <Text style={styles.quantityButton}>-</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeProduct(item.producto_id)}>
                                <Text style={styles.removeButton}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={styles.totalsContainer}>
                <Text style={styles.totalText}>Subtotal: ${subtotal.toFixed(2)}</Text>
                <Text style={styles.totalText}>IVA (8%): ${iva.toFixed(2)}</Text>
                <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
            </View>

            <Button title="Crear Ticket" onPress={handleCreateTicket} color="#d17609" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#5c646b',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        fontSize: 20,
        marginHorizontal: 5,
        color: 'white',
    },
    removeButton: {
        color: 'red',
        marginHorizontal: 10,
        fontWeight: 'bold',
    },
    totalsContainer: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        
    },
    totalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        paddingLeft:10
    },
    TextP:{
        color:"white"
    }
});

export default Venta;
