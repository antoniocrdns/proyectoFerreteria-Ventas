import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Button, ScrollView, Alert,Text } from "react-native";
import axios from "axios";

const Usuarios = () => {
    const [username, setUsername] = useState("");
    const [password, setContrasena] = useState(""); 
    const [rol_id, setRol] = useState(""); 
    const [isLoading, setIsLoading] = useState(false); 
    const apiUrl = "http://localhost:3000/api/usuarios"; 


    //registro usuario
    const registrarUsuario = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(apiUrl, {
                //declaro mis variables para registar al usuario
                username, 
                password,
                rol_id,
            });
            Alert.alert("Registro exitoso", `ID: ${response.data.id}`); 
            console.log("Registro exitoso", `ID: ${response.data.id}`);
            limpiarCampos();
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            Alert.alert("Error", "No se pudo registrar el usuario");
        } finally {
            setIsLoading(false);
        }
    };

    const limpiarCampos = () => {
        setUsername("");
        setContrasena("");
        setRol("");
    };


    return (
        <ScrollView>
            
            <View style={styles.container}>
            <Text style={styles.header}>Registrar Usuarios</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}//llamo a mi variable
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contrasena"
                    value={password}
                    onChangeText={setContrasena}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Rol"
                    value={rol_id}
                    onChangeText={setRol}
                />
                <Button title="Registrar Usuario" onPress={registrarUsuario} disabled={isLoading} />


            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: "10%",
    },
    input: {
        backgroundColor: "white",
        width: '90%',
       /*  height: '30px',  */
        borderColor: '#e8e8e8',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 8,
        padding: 8//anchura del input
       
    },
    item: {
        padding: 10,
        borderBottomWidth: 10,
        borderBottomColor: '#e8e8e8',
        width: '90%',
        
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 60, //se mueve el encabezado principal
    },
});

export default Usuarios;
