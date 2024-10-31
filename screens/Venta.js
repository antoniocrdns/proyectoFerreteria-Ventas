import React from "react";
import { View, TextInput,StyleSheet,Button,Switch, Text,ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Venta = () => {

    const navigation = useNavigation();
    
    
    return (
        <ScrollView>
        <View style={styles.container}>
        <TextInput style={styles.input} placeholder="id producto"/>
        <TextInput style={styles.input} placeholder="Cantidad"/>

        <Button style={styles.boton} title="Comprar Producto"/>
        
        <Button style={styles.boton} title="Ver Ticket"/>
        <Button style={styles.boton} title="Eliminar ticket"/>




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
        marginVertical:1
    },
    
    
    });
export default Venta;