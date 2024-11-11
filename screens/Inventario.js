import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity, FlatList, Switch, Alert } from "react-native";
import axios from 'axios';

const BASE_URL = "http://127.0.0.1:3000/api/productos";

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [editando, setEditando] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [precio, setPrecio] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [activo, setActivo] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            const response = await axios.get(BASE_URL);
            setProductos(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudieron cargar los productos.");
        }
    };

    const validarCampos = (producto, esNuevoProducto = true) => {
        if (esNuevoProducto && !producto.id) {
            setError("El ID del producto es obligatorio.");
            return false;
        }
        if (!producto.nombre || !producto.proveedor || producto.precio === '' || producto.cantidad === '') {
            setError("Todos los campos son obligatorios.");
            return false;
        }
        if (isNaN(producto.precio) || isNaN(producto.cantidad)) {
            setError("Precio y Cantidad deben ser números, además de no poder quedar vacíos.");
            return false;
        }
        if (producto.precio <= 0 || producto.cantidad <= 0) {
            setError("Precio y Cantidad deben ser mayores que cero.");
            return false;
        }
        if (esNuevoProducto && productos.some(p => p.id === producto.id)) {
            setError("El ID del producto ya existe.");
            return false;
        }
        setError('');
        return true;
    };

    const registrarProducto = async () => {
        const producto = { id, nombre, proveedor, precio: parseFloat(precio), cantidad: parseInt(cantidad), activo: activo ? 1 : 0 };
        if (!validarCampos(producto)) return;

        try {
            await axios.post(BASE_URL, producto, {
                headers: { 'Content-Type': 'application/json' },
            });
            setMostrarFormulario(false);
            obtenerProductos();
            Alert.alert("Éxito", "Producto agregado correctamente.");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo registrar el producto.");
        }
    };

    const actualizarProducto = async () => {
        const producto = { id, nombre, proveedor, precio: parseFloat(precio), cantidad: parseInt(cantidad), activo: activo ? 1 : 0 };
        if (!validarCampos(producto, false)) return;

        try {
            await axios.put(`${BASE_URL}/${id}`, producto, {
                headers: { 'Content-Type': 'application/json' },
            });
            setEditando(null);
            obtenerProductos();
            Alert.alert("Éxito", "Producto actualizado correctamente.");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo actualizar el producto.");
        }
    };

    const iniciarEdicion = (producto) => {
        setId(producto.id);
        setNombre(producto.nombre);
        setProveedor(producto.proveedor);
        setPrecio(producto.precio.toString());
        setCantidad(producto.cantidad.toString());
        setActivo(producto.activo === 1);
        setEditando(producto.id);
    };

    const renderItem = ({ item }) => {
        if (editando === item.id) {
            return (
                <View style={styles.productItem}>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TextInput 
                        style={styles.input} 
                        placeholder="Nombre Producto" 
                        value={nombre} 
                        onChangeText={setNombre}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Proveedor" 
                        value={proveedor} 
                        onChangeText={setProveedor}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Precio" 
                        value={precio} 
                        onChangeText={(text) => setPrecio(text ? parseFloat(text) : '')}
                        keyboardType="numeric"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Cantidad" 
                        value={cantidad} 
                        onChangeText={(text) => setCantidad(text ? parseInt(text) : '')}
                        keyboardType="numeric"
                    />
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Activo</Text>
                        <Switch
                            value={activo}
                            onValueChange={setActivo}
                        />
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={actualizarProducto}> 
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.productItem}>
                    <Text style={styles.productText}>ID: {item.id}</Text> {/* Mostrar el ID del producto */}
                    <Text style={styles.productText}>{item.nombre}</Text>
                    <Text style={styles.productText}>Proveedor: {item.proveedor}</Text>
                    <Text style={styles.productText}>Precio: ${item.precio}</Text>
                    <Text style={styles.productText}>Cantidad: {item.cantidad}</Text>
                    <Text style={styles.productText}>Activo: {item.activo ? 'Sí' : 'No'}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => iniciarEdicion(item)}>
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.header}>Inventario de Productos</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setMostrarFormulario(!mostrarFormulario)}>
                    <Text style={styles.buttonText}>Añadir Producto</Text>
                </TouchableOpacity>
                {mostrarFormulario && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Registrar Producto</Text>
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        <TextInput 
                            style={styles.input} 
                            placeholder="ID Producto" 
                            value={id} 
                            onChangeText={setId}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Nombre Producto" 
                            value={nombre} 
                            onChangeText={setNombre}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Proveedor" 
                            value={proveedor} 
                            onChangeText={setProveedor}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Precio" 
                            value={precio} 
                            onChangeText={(text) => setPrecio(text ? parseFloat(text) : '')}
                            keyboardType="numeric"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Cantidad" 
                            value={cantidad} 
                            onChangeText={(text) => setCantidad(text ? parseInt(text) : '')}
                            keyboardType="numeric"
                        />
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Activo</Text>
                            <Switch
                                value={activo} 
                                onValueChange={setActivo}
                            />
                        </View>
                        <TouchableOpacity style={styles.saveButton} onPress={registrarProducto}>
                            <Text style={styles.buttonText}>Registrar Producto</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <FlatList
                    data={productos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#5c646b', // Fondo claro
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    section: {
        marginBottom: 30,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    input: {
        height: 40,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#FAFAFA',
    },
    addButton: {
        backgroundColor: '#d17609',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#d17609',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#d17609',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    productItem: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    switchLabel: {
        marginRight: 10,
    },
});


export default Inventario;
