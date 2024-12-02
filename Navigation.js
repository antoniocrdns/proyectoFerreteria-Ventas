import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "./utils/AuthContext";
import { AuthProvider } from "./utils/AuthContext";

// Screens
import Inventario from "./screens/Inventario";
import Venta from "./screens/Venta";
import Usuarios from "./screens/Usuarios";
import Login from "./screens/Login";
import Tickets from "./screens/Tickets";
import Load from "./screens/Load";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, Text } from "react-native";

const Tab = createBottomTabNavigator();

function MyTabs() {
    const { userRole, logout } = useContext(AuthContext);

    return (
        <Tab.Navigator
            initialRouteName="Load"
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: 'orange',
                headerRight: () =>
                    userRole ? (
                        <TouchableOpacity onPress={logout} style={{ paddingRight: 15 }}>
                            <MaterialCommunityIcons name="logout" color="orange" size={25} />
                        </TouchableOpacity>
                    ) : null,
            })}
        >
            <Tab.Screen 
                name="Load" 
                component={Load} 
                options={{
                    tabBarStyle: { display: 'none' },
                    headerShown: false,
                    tabBarButton: () => null, // Oculta el botón de la pestaña
                }} 
            />
            {!userRole && (
                <Tab.Screen 
                    name="Login" 
                    component={Login} 
                    options={{
                        tabBarLabel: 'Login',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="login" color={color} size={30} />
                        ),
                        headerShown: false, // Ocultar header en la pantalla de Login
                    }}
                />
            )}
            {userRole === 1 && (
                <>
                    <Tab.Screen 
                        name="Inventario" 
                        component={Inventario} 
                        options={{
                            tabBarLabel: 'Inventario',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="warehouse" color={color} size={30} />
                            ),
                        }}
                    />
                    <Tab.Screen 
                        name="Venta" 
                        component={Venta}
                        options={{
                            tabBarLabel: 'Venta',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="cart" color={color} size={30} />
                            ),
                        }}
                    />
                    <Tab.Screen 
                        name="Usuario" 
                        component={Usuarios}
                        options={{
                            tabBarLabel: 'Usuarios',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="account-group" color={color} size={30} />
                            ),
                        }}
                    />
                    <Tab.Screen 
                        name="Tickets" 
                        component={Tickets}
                        options={{
                            tabBarLabel: 'Tickets',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="ticket" color={color} size={30} />
                            ),
                        }}
                    />
                </>
            )}
            {userRole === 2 && (
                <>
                    <Tab.Screen 
                        name="Venta" 
                        component={Venta}
                        options={{
                            tabBarLabel: 'Venta',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="cart" color={color} size={30} />
                            ),
                        }}
                    />
                    <Tab.Screen 
                        name="Tickets" 
                        component={Tickets}
                        options={{
                            tabBarLabel: 'Tickets',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="ticket" color={color} size={30} />
                            ),
                        }}
                    />
                </>
            )}
            {userRole === 3 && (
                <Tab.Screen 
                    name="Inventario" 
                    component={Inventario}
                    options={{
                        tabBarLabel: 'Inventario',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="warehouse" color={color} size={30} />
                        ),
                    }}
                />
            )}
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <MyTabs />
            </NavigationContainer>
        </AuthProvider>
    );
}
