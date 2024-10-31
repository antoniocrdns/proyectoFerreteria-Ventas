import React from "react";
import { View, TextInput,StyleSheet,Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Login = () => {

    const navigation = useNavigation();
    
    
    return (
        <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Usuario"/>
        <TextInput style={styles.input} placeholder="Contrasena"/>

        <Button  title="Iniciar Seccion"/>
    </View>
);
}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop:"20%"
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
export default Login;