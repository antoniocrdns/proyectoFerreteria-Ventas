import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView, Modal, TouchableOpacity, Picker } from "react-native";
import axios from "axios";
import { Table, Row, Rows } from "react-native-table-component";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rol_id, setRol] = useState("");
    const [roles, setRoles] = useState([]);  // Nuevo estado para almacenar los roles
    const [editingUserId, setEditingUserId] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Variables de estado para los campos en el modal
    const [modalUsername, setModalUsername] = useState("");
    const [modalPassword, setModalPassword] = useState("");
    const [modalRol, setModalRol] = useState("");

    const apiUrlUsuarios = "http://localhost:3000/api/usuarios";
    const apiUrlRoles = "http://localhost:3000/api/roles";

    useEffect(() => {
        obtenerRoles();
    }, []);

    useEffect(() => {
        if (roles.length > 0) {
            verListaUsuarios();
        }
    }, [roles]);

    const obtenerRoles = async () => {
        try {
            const response = await axios.get(apiUrlRoles);
            setRoles(response.data);
        } catch (error) {
            Alert.alert("Error", "No se pudo obtener la lista de roles");
            alert("Error", "No se pudo obtener la lista de roles");
        }
    };

    const verListaUsuarios = async () => {
        try {
            const response = await axios.get(apiUrlUsuarios);
            setUsuarios(response.data);

            const data = response.data.map((usuario) => {
                const rolNombre = roles.find((rol) => rol.id === usuario.rol_id)?.nombre || "Rol desconocido";
                return [
                    usuario.username,
                    '******',
                    rolNombre,
                    <View style={styles.buttonContainer}>
                        <Button title="Editar" onPress={() => abrirModalEdicion(usuario)} />
                    </View>,
                    <View style={styles.buttonContainer}>
                        <Button title="Borrar" color="red" onPress={() => borrarUsuario(usuario.id)} />
                    </View>
                ];
            });
            setTableData(data);
        } catch (error) {
            Alert.alert("Error", "No se pudo obtener la lista de usuarios");
            alert("Error", "No se pudo obtener la lista de usuarios");
        }
    };

    const guardarUsuario = async () => {
        if (!username || !password || !rol_id) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            alert("Error", "Todos los campos son obligatorios");
            return;
        }

        try {
            await axios.post(apiUrlUsuarios, { username, password, rol_id });
            Alert.alert("Usuario añadido");
            alert("Usuario añadido");
            limpiarCampos();
            verListaUsuarios();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el usuario");
            alert("Error", "No se pudo guardar el usuario");
        }
    };

    const actualizarUsuario = async () => {
        if (!editingUserId) return;
        try {
            await axios.put(`${apiUrlUsuarios}/${editingUserId}`, { username: modalUsername, password: modalPassword, rol_id: modalRol });
            Alert.alert("Usuario actualizado");
            alert("Usuario actualizado");
            cerrarModal();
            verListaUsuarios();
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el usuario");
            alert("Error", "No se pudo actualizar el usuario");
        }
    };

    const abrirModalEdicion = (usuario) => {
        setModalUsername(usuario.username);
        setModalPassword(usuario.password);
        setModalRol(usuario.rol_id);
        setEditingUserId(usuario.id);
        setIsModalVisible(true);
    };

    const borrarUsuario = async (id) => {
        try {
            await axios.delete(`${apiUrlUsuarios}/${id}`);
            Alert.alert("Usuario eliminado");
            alert("Usuario eliminado");
            verListaUsuarios();
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el usuario");
            alert("Error", "No se pudo eliminar el usuario");
        }
    };

    const limpiarCampos = () => {
        setUsername("");
        setPassword("");
        setRol("");
    };

    const cerrarModal = () => {
        setModalUsername("");
        setModalPassword("");
        setModalRol("");
        setEditingUserId(null);
        setIsModalVisible(false);
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>Gestión de Usuarios</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />

                {/* Selector de rol */}
                <Picker
                    selectedValue={rol_id}
                    style={styles.input}
                    onValueChange={(itemValue) => setRol(itemValue)}
                >
                    <Picker.Item label="Selecciona un rol" value="" />
                    {roles.map((rol) => (
                        <Picker.Item key={rol.id} label={rol.nombre} value={rol.id} />
                    ))}
                </Picker>
                
                <Button 
                    title="Añadir Usuario"
                    onPress={guardarUsuario} 
                />

                <Table borderStyle={{ borderWidth: 1, borderColor: '#abb2b9' }} style={styles.table}> 
                    <Row
                        data={["Username", "Contraseña", "Rol", "Editar", "Borrar"]}
                        style={styles.head}
                        textStyle={styles.headText}
                    />
                    <Rows
                        data={tableData}
                        textStyle={styles.text}
                    />
                </Table>

                {/* Modal para edición */}
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Editar Usuario</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                value={modalUsername}
                                onChangeText={setModalUsername}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                value={modalPassword}
                                onChangeText={setModalPassword}
                                secureTextEntry={true}
                            />

                            {/* Selector de rol en el modal */}
                            <Picker
                                selectedValue={modalRol}
                                style={styles.input}
                                onValueChange={(itemValue) => setModalRol(itemValue)}
                            >
                                <Picker.Item label="Selecciona un rol" value="" />
                                {roles.map((rol) => (
                                    <Picker.Item key={rol.id} label={rol.nombre} value={rol.id} />
                                ))}
                            </Picker>

                            <Button title="Guardar Cambios" onPress={actualizarUsuario} />
                            <TouchableOpacity onPress={cerrarModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: "5%",
    },
    input: {
        backgroundColor: "white",
        width: '90%',
        borderColor: '#e8e8e8',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginVertical: 8,
    },
    table: {
        width: '90%',
        marginTop: 20,
    },
    head: {
        height: 50,
        backgroundColor: '#d6dbdf',
    },
    headText: {
        textAlign: "center",
        fontWeight: "bold",
    },
    text: {
        margin: 6,
        textAlign: "center",
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 60,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    closeButton: {
        marginTop: 20,
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 16,
    },
});

export default Usuarios;
