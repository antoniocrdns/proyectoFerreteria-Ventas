import React from "react";
import { View, TextInput,StyleSheet,Button, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Usuarios = () => {

    const navigation = useNavigation();
    
    
    return (
        <ScrollView>
        <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Nombre"/>
        <TextInput style={styles.input} placeholder="Contrasena"/>
        <TextInput style={styles.input} placeholder="Rol"/>

        <Button  title="Registrar Usuario"/>
        
        <TextInput style={styles.input} placeholder="Id Usuario"/>
        <TextInput style={styles.input} placeholder="Nombre"/>

        <TextInput style={styles.input} placeholder="Contrasena"/>
                <TextInput style={styles.input} placeholder="Rol"/>

        <Button  title="Actualizar Usuario"/>
        
        <TextInput style={styles.input} placeholder="Id Usuario"/>
        <Button  title="Borrar"/>
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
    marginTop:"5%"
    },
    input:{
        backgroundColor:"white",
        width:'90%',
        borderColor:'#e8e8e8',
        borderRadius:5,
        paddingHorizontal:10,
        marginVertical:5
    },
    
    
    });
export default Usuarios;