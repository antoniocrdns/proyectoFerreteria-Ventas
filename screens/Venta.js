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
                Alert.alert('Error', 'Producto inactivo o sin stock disponible');
                alert('Error', 'Producto inactivo o sin stock disponible');
                return null;
            }
            return product;
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Producto no encontrado');
            alert('Error', error.response?.data?.message || 'Producto no encontrado');
            return null;
        }
    };

    const addProduct = async () => {
        if (productId) {
            const existingProduct = products.find(p => p.producto_id === productId);
            if (existingProduct) {
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
                        precio_unitario: product.precio       
                    }]);
                }
            }
            setProductId('');
        } else {
            Alert.alert('Error', 'Por favor ingrese un ID de producto válido');
            alert('Error', 'Por favor ingrese un ID de producto válido');
        }
    };

    const removeProduct = (id) => {
        setProducts(products.filter(p => p.producto_id !== id));
    };

    const updateQuantity = (id, increment) => {
        setProducts(products.map(p =>
            p.producto_id === id
                ? { ...p, cantidad: Math.max(0, p.cantidad + increment) }
                : p
        ));
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

            Alert.alert('Éxito', `Ticket creado exitosamente con ID: ${ticketId}`);
            alert('Éxito', `Ticket creado exitosamente con ID: ${ticketId}`);

            setProducts([]);
            setProductId('');
        } catch (error) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Hubo un problema al crear el ticket. Inténtalo de nuevo.'
            );
            alert(
                'Error',
                error.response?.data?.message || 'Hubo un problema al crear el ticket. Inténtalo de nuevo.'
            );
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
            <Button title="Añadir Producto" onPress={addProduct} />

            <FlatList
                data={products}
                keyExtractor={item => item.producto_id}
                renderItem={({ item }) => (
                    <View style={styles.productRow}>
                        <Text>{item.producto_id} | {item.nombre}</Text>
                        <Text>Precio: ${item.precio_unitario.toFixed(2)}</Text>
                        <Text>Cantidad: {item.cantidad}</Text>
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

            <Button title="Crear Ticket" onPress={handleCreateTicket} color="#4CAF50" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF8E1', // Fondo blanco tirando a amarillo claro
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#333',
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
        color: '#333',
    },
    removeButton: {
        color: 'red',
        marginHorizontal: 10,
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
    },
});

export default Venta;
