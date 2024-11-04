import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ApiClient, { setAuthToken } from "../utils/ApiClient"; // Asegúrate de importar setAuthToken
import { AuthContext } from "../utils/AuthContext"; 

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { login } = useContext(AuthContext); 

    const handleLogin = async () => {
        setLoading(true);

        try {
            const response = await ApiClient.post("/auth/login", {
                username,
                password,
            });

            if (response.status === 200) {
                const userRole = response.data.user.rol_id; // Cambiado a 'rol_id'
                const token = response.data.token; // Asegúrate de que el token se incluya en la respuesta, si no, ajústalo según tu API
                login(userRole);
                setAuthToken(token); // Establece el token de autorización
                navigation.navigate("Venta");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Usuario o contraseña incorrectos";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input} 
                placeholder="Usuario" 
                value={username}
                onChangeText={setUsername}
            />
            <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: "20%",
    },
    input: {
        backgroundColor: "white",
        width: '90%',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
});

export default Login;
