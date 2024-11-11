import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ApiClient, { setAuthToken } from "../utils/ApiClient";
import { AuthContext } from "../utils/AuthContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



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
            <View style={styles.buttonContainer}>

                    <MaterialCommunityIcons onPress={() => borrarUsuario(usuario.id)} 
                    name="account"size={90} color={"black"} />

                            </View>
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
        display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#5c646b',
    },
    
    logo: {
        width: 12,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#dde9f1',
        marginBottom: 30,
    },
    input: {
        backgroundColor: "#FFFFFF",
    width: '90%',
    maxWidth: 300,
    borderColor: '#FF5733',
    borderWidth: 1,
    borderRadius: 12,  // Aumenté el radio para que sea más visible
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',

    // Sombra ligera para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Sombra para Android
    elevation: 5,    // Eleva más para una sombra más fuerte

    // Borde redondeado
    borderRadius: 12,
           
    },
      
    loginButton: {
        backgroundColor: '#d17609',
        width: '90%',           // Ajuste de ancho para mantenerlo compacto
        maxWidth: 300,          // Máximo ancho en dispositivos grandes
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,  // Relleno más compacto
        paddingVertical: 8,     // Relleno vertical reducido
        marginVertical: 8,      // Margen vertical reducido
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',    // Sombra ligera (opcional)
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,  
        alignItems: 'center',          
        justifyContent: 'center',     
        
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    
});

export default Login;
