import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";

//screens

import Inventario from "./screens/Inventario";
import Venta from "./screens/Venta";
import Registro from "./screens/Registro";
import Usuarios from "./screens/Usuarios";
import Login from "./screens/Login";



import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeStackNavigator = createNativeStackNavigator();




const Tab = createBottomTabNavigator();

function MyTabs() {
return (
    <Tab.Navigator
        initialRouteName="Login"
        screenOptions= {{
            tabBarActiveTintColor: 'purple',
        }}
    >
        <Tab.Screen 
            name="Login" 
            component={Login} 
            options={{
                tabBarLabel: 'Login',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="numeric-1" color={color} size={30} />
                ),
                
            }}
        />
        <Tab.Screen 
            name="Inventario" 
            component={Inventario}
            options={{
                tabBarLabel: 'Inventario',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="numeric-2" color={color} size={30} />
                ),
            }}
        />
        <Tab.Screen 
            name="Venta" 
            component={Venta}
            options={{
                tabBarLabel: 'Venta',
                tabBarIcon: ({ color, size }) => (
                    
                    <MaterialCommunityIcons  name="numeric-3" color={color} size={30} />
                ),
                
            }}
        />
        <Tab.Screen 
            name="Registro" 
            component={Registro}
            options={{
                tabBarLabel: 'Registro',
                tabBarIcon: ({ color, size }) => (

               <MaterialCommunityIcons  name="numeric-4" color={color} size={30} />
           ),
           
       }}
   />
        <Tab.Screen 
        name="Usuario" 
        component={Usuarios}
        options={{
            tabBarLabel: 'Usuario',
            tabBarIcon: ({ color, size }) => (
                
                <MaterialCommunityIcons  name="numeric-4" color={color} size={30} />
            ),
            
        }}
    />
    </Tab.Navigator>
    );
}


export default function Navigation() {
return (
    <NavigationContainer>
    <MyTabs />
    </NavigationContainer>
);
}