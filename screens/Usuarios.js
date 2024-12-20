import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView, Modal, TouchableOpacity, Picker } from "react-native";
import axios from "axios";
import { Table, Row, Rows } from "react-native-table-component";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rol_id, setRol] = useState("");
    const [roles, setRoles] = useState([]);  //nuevo estado para almacenar los roles
    const [editingUserId, setEditingUserId] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // variables de estado para los campos en el modal
    const [modalUsername, setModalUsername] = useState("");
    const [modalPassword, setModalPassword] = useState("");
    const [modalRol, setModalRol] = useState("");
    //estado para el modal de confirmar cuando elimina
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const apiUrlUsuarios = "http://127.0.0.1:3000/api/usuarios";
    const apiUrlRoles = "http://127.0.0.1:3000/api/roles";

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
                        <MaterialCommunityIcons onPress={() => abrirModalEdicion(usuario)} name="vector-square-edit"size={30} color={"#5ccb5f"} />

                    </View>,
                    <View style={styles.buttonContainer}>

                        <MaterialCommunityIcons onPress={() => borrarUsuario(usuario.id)} name="trash-can"size={30} color={"red"} />
                    
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
            Alert.alert("Error Todos los campos son obligatorios");
            alert("Error Todos los campos son obligatorios");
            return;
        }
    
        try {
            await axios.post(apiUrlUsuarios, { username, password, rol_id });
            
            const nuevoUsuario = { username, password, rol_id };
            setUsuarios(prevUsuarios => [...prevUsuarios, nuevoUsuario]);
    
            Alert.alert("Usuario añadido");
            alert("Usuario añadido");
            limpiarCampos();
            verListaUsuarios(); 
        } catch (error) {
            Alert.alert("Error No se pudo guardar el usuario");
            alert("Error No se pudo guardar el usuario");
        }
    };
    
    const actualizarUsuario = async () => {
        if (!editingUserId) return;
        try {
            await axios.put(`${apiUrlUsuarios}/${editingUserId}`, { username: modalUsername, password: modalPassword, rol_id: modalRol });
            Alert.alert("Usuario actualizado", "El usuario ha sido actualizado correctamente.");
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

    const borrarUsuario = (id) => {
        setUserToDelete(id);
        setShowDeleteModal(true);  // aqui abre el modal de confirmar si se elimina el usuario
    };

   
   
    const confirmarBorrado = async () => {
        if (userToDelete) {
            //encuentra el usuario que tiene el ID `userToDelete` en la lista de usuarios
            const usuario = usuarios.find(u => u.id === userToDelete);
    
            //verifica si el rol del usuario es 'admin' (rol_id = 1)
            if (usuario && usuario.rol_id === 1) {
                Alert.alert("Error no se puede eliminar al usuario administrador.");
                return; 
            }
    
            try {
                await axios.delete(`${apiUrlUsuarios}/${userToDelete}`);
                Alert.alert("Usuario eliminado el usuario ha sido eliminado correctamente.");
                alert("Usuario eliminado");
                verListaUsuarios();
            } catch (error) {
                Alert.alert("Error no se pudo eliminar el usuario");
                alert("Error", "No se pudo eliminar el usuario");
            }
        }
        setShowDeleteModal(false);  // cierra el modal
    };

    const cancelarBorrado = () => {
        setShowDeleteModal(false);  // cierra el modal
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
        <ScrollView style={{ flex: 1, backgroundColor: '#5c646b' }}>
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

                {/* selector de rol */}
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
                    color="#d17609"
                />

                <Table borderStyle={{ borderWidth: 1, borderColor: 'white' }} style={styles.table}>
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

                {/* modal para edicion */}
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

                            {/* selector de rol en el modal */}
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
                            <View style={styles.modalButtons2}>
                            <Button  style={styles.Boton} title="Guardar Cambios" onPress={actualizarUsuario} color="#d17609"/>
                            <TouchableOpacity onPress={cerrarModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* modal para confirmar que elimina al usuario */}
                {showDeleteModal && (
                    <Modal
                        transparent={true}
                        visible={showDeleteModal}
                        animationType="fade"
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>CONFIRMACIÓN DE ELIMINACIÓN</Text>
                                <Text style={styles.modalMessage}>
                                    ¿Estás seguro de que deseas eliminar este usuario?
                                </Text>
                                <View style={styles.modalButtons}>
                                    <Button title="Cancelar" color="#d17609" onPress={cancelarBorrado} />
                                    <Button title="Eliminar" color="red" onPress={confirmarBorrado} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#5c646b',  // Fondo claro amarillo suave
    },
    input: {
        backgroundColor: "#FAFAFA",
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginVertical: 8,
    },
    table: {
        width: '90%',
        marginTop: 20,
        backgroundColor: '#5c646b',  // Fondo blanco en tabla para contraste
        borderRadius: 5,
        overflow: 'hidden',
    },
    head: {
        height: 50,
        backgroundColor: '#d17609',
    },
    headText: {
        textAlign: "center",
        fontWeight: "bold",
        color: 'white',
    },
    text: {
        margin: 6,
        textAlign: "center",
        color: 'white',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#5c646b',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        textAlign:"center"
    },
    closeButton: {
        marginTop: 20,
        
    },
    closeButtonText: {
        color: '#d17609',
        fontSize: 16,
        fontWeight:"bold"
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        color: 'white',
        textAlign:"center"
    },
    modalButtons2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 3,
    },

});

export default Usuarios;
