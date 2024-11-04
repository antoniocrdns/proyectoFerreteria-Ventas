<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity, FlatList, Switch } from "react-native";
import axios from 'axios';

// URL base de la API para gestionar los productos
const BASE_URL = "http://127.0.0.1:3000/api/productos"; // Asegúrate de usar la dirección IP correcta

const Inventario = () => {
    // Definición de los estados del componente
    const [productos, setProductos] = useState([]); // Lista de productos
    const [editando, setEditando] = useState(null); // ID del producto que se está editando
    const [mostrarFormulario, setMostrarFormulario] = useState(false); // Controla la visibilidad del formulario
    const [id, setId] = useState(''); // Estado para el ID del producto
    const [nombre, setNombre] = useState(''); // Estado para el nombre del producto
    const [proveedor, setProveedor] = useState(''); // Estado para el proveedor del producto
    const [precio, setPrecio] = useState(''); // Estado para el precio del producto
    const [cantidad, setCantidad] = useState(''); // Estado para la cantidad del producto
    const [activo, setActivo] = useState(true); // Estado para el estado activo del producto

    // Hook que se ejecuta al montar el componente
    useEffect(() => {
        obtenerProductos(); // Llama a la función para obtener los productos
    }, []);

    // Función para obtener la lista de productos desde la API
    const obtenerProductos = async () => {
        try {
            const response = await axios.get(BASE_URL); // Realiza la solicitud GET
            setProductos(response.data); // Actualiza el estado con la lista de productos
        } catch (error) {
            console.error(error); // Maneja errores
        }
    };

    // Función para registrar un nuevo producto
    const registrarProducto = async () => {
        try {
            const producto = { id, nombre, proveedor, precio, cantidad, activo: activo ? 1 : 0 }; // Crea un objeto con los datos del producto
            await axios.post(BASE_URL, producto, { // Realiza la solicitud POST
                headers: {
                    'Content-Type': 'application/json', // Establece el tipo de contenido
                },
            });
            setMostrarFormulario(false); // Oculta el formulario
            obtenerProductos(); // Actualiza la lista de productos
        } catch (error) {
            console.error(error); // Maneja errores
        }
    };

    // Función para actualizar un producto existente
    const actualizarProducto = async (producto) => {
        try {
            await axios.put(`${BASE_URL}/${producto.id}`, producto, { // Realiza la solicitud PUT
                headers: {
                    'Content-Type': 'application/json', // Establece el tipo de contenido
                },
            });
            setEditando(null); // Resetea el estado de edición
            obtenerProductos(); // Actualiza la lista de productos
        } catch (error) {
            console.error(error); // Maneja errores
        }
    };

    // Función para renderizar cada producto en la lista
    const renderItem = ({ item }) => {
        if (editando === item.id) { // Si se está editando el producto actual
            return (
                <View style={styles.productItem}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Nombre Producto" 
                        value={item.nombre} 
                        onChangeText={(text) => setProductos(productos.map(p => p.id === item.id ? { ...p, nombre: text } : p))} // Actualiza el nombre del producto
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Proveedor" 
                        value={item.proveedor} 
                        onChangeText={(text) => setProductos(productos.map(p => p.id === item.id ? { ...p, proveedor: text } : p))} // Actualiza el proveedor del producto
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Precio" 
                        value={item.precio.toString()} 
                        onChangeText={(text) => setProductos(productos.map(p => p.id === item.id ? { ...p, precio: parseFloat(text) } : p))} // Actualiza el precio del producto
                        keyboardType="numeric"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Cantidad" 
                        value={item.cantidad.toString()} 
                        onChangeText={(text) => setProductos(productos.map(p => p.id === item.id ? { ...p, cantidad: parseInt(text) } : p))} // Actualiza la cantidad del producto
                        keyboardType="numeric"
                    />
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Activo</Text>
                        <Switch
                            value={item.activo} // Estado del switch para activo
                            onValueChange={(value) => setProductos(productos.map(p => p.id === item.id ? { ...p, activo: value } : p))} // Actualiza el estado activo del producto
                        />
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={() => actualizarProducto(item)}> // Botón para guardar cambios
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            );
        } else { // Si no se está editando
            return (
                <View style={styles.productItem}>
                    <Text style={styles.productText}>{item.nombre}</Text>
                    <Text style={styles.productText}>Proveedor: {item.proveedor}</Text>
                    <Text style={styles.productText}>Precio: ${item.precio}</Text>
                    <Text style={styles.productText}>Cantidad: {item.cantidad}</Text>
                    <Text style={styles.productText}>Activo: {item.activo ? 'Sí' : 'No'}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditando(item.id)}> // Botón para editar el producto
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>Inventario de Productos</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setMostrarFormulario(!mostrarFormulario)}> // Botón para mostrar/ocultar el formulario
                    <Text style={styles.buttonText}>Registrar Producto</Text>
                </TouchableOpacity>
                {mostrarFormulario && ( // Si se debe mostrar el formulario
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Registrar Producto</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="ID Producto" 
                            value={id} 
                            onChangeText={setId} // Actualiza el estado del ID
                            keyboardType="default"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Nombre Producto" 
                            value={nombre} 
                            onChangeText={setNombre} // Actualiza el estado del nombre
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Proveedor" 
                            value={proveedor} 
                            onChangeText={setProveedor} // Actualiza el estado del proveedor
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Precio" 
                            value={precio} 
                            onChangeText={setPrecio} // Actualiza el estado del precio
                            keyboardType="numeric"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Cantidad" 
                            value={cantidad} 
                            onChangeText={setCantidad} // Actualiza el estado de la cantidad
                            keyboardType="numeric"
                        />
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Activo</Text>
                            <Switch
                                value={activo} // Estado del switch para activo
                                onValueChange={setActivo} // Actualiza el estado activo
                            />
                        </View>
                        <TouchableOpacity style={styles.saveButton} onPress={registrarProducto}> // Botón para registrar el nuevo producto
                            <Text style={styles.buttonText}>Registrar Producto</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <FlatList
                    data={productos} // Lista de productos a mostrar
                    keyExtractor={(item) => item.id.toString()} // Clave única para cada elemento
                    renderItem={renderItem} // Función para renderizar cada elemento
                />
            </View>
        </ScrollView>
    );
};

// Estilos del componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    section: {
        marginBottom: 30,
        backgroundColor: '#fff',
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
        color: '#007bff',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
    addButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#ffc107',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    productItem: {
        backgroundColor: '#fff',
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
=======
import React from "react";
import { View, TextInput,StyleSheet , Button, ScrollView} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Inventario = () => {

    const navigation = useNavigation();
    
    
    return (
        <ScrollView>
        <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Nombre Producto"/>
        <TextInput style={styles.input} placeholder="Proveedor"/>
        <TextInput style={styles.input} placeholder="Precio"/>
        <TextInput style={styles.input} placeholder="Cantidad"/>
        <TextInput style={styles.input} placeholder="Codigo"/>

        <Button  title="Registrar Producto"/>
        <TextInput style={styles.input} placeholder="Id Producto"/>
        <TextInput style={styles.input} placeholder="Codigo"/>
        <TextInput style={styles.input} placeholder="¿Esta disponible?"/>

        <Button  title="Actualizar"/>

        <Button  title="Ver lista"/>
    </View>
    </ScrollView>
);
}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop:"10%"
    },
    input:{
        backgroundColor:"white",
        width:'90%',
        borderColor:'#e8e8e8',
        borderWidth:1,
        borderRadius:5,
        paddingHorizontal:10,
        marginVertical:5
    },
    
    });
export default Inventario;
>>>>>>> upstream/main
