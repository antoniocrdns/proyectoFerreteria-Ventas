import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ApiClient, { setAuthToken } from "../utils/ApiClient";
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
                const userRole = response.data.user.rol_id;
                const token = response.data.token;
                login(userRole);
                setAuthToken(token);
                navigation.navigate("Venta");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Usuario o contraseña incorrectos";
            Alert.alert("Error", errorMessage);
            alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/icon.png')} style={styles.logo} /> 
            <Text style={styles.title}>Bienvenido</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Usuario" 
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
            ) : (
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFF8E1',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    input: {
        backgroundColor: "#FFFFFF",
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 10,
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        marginTop: 20,
    },
});

export default Login;