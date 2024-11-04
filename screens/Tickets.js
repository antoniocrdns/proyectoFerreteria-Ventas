import * as React from "react";
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

const Tickets = () => {
    const [tickets, setTickets] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedTicket, setSelectedTicket] = React.useState(null);

    const getTickets = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/tickets");
            setTickets(response.data.sort((a, b) => a.ticket_id - b.ticket_id)); // Ordenar por ticket_id
        } catch (error) {
            console.error("Error fetching tickets:", error);
            Alert.alert("No se pudieron cargar los tickets.");
            alert("No se pudieron cargar los tickets.");
        }
    };

    const cancelTicket = async (ticketId) => {
        try {
            await axios.delete(`http://localhost:3000/api/tickets/${ticketId}`);
            Alert.alert("Ticket cancelado.");
            alert("Ticket cancelado.");
            getTickets(); // Volver a obtener tickets después de cancelar
        } catch (error) {
            console.error("Error canceling ticket:", error);
            Alert.alert("No se pudo cancelar el ticket.");
            alert("No se pudo cancelar el ticket.");
        }
    };

    const viewTicketContent = (ticket) => {
        setSelectedTicket(ticket);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTicket(null);
    };

    React.useEffect(() => {
        getTickets();
    }, []);


    const cancelledTickets = tickets.filter(ticket => ticket.cancelada === 1);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tickets Activos</Text>
            <FlatList
                data={tickets.filter(ticket => ticket.cancelada === 0)}
                keyExtractor={(item) => item.ticket_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.ticketItem}>
                        <Text style={styles.ticketText}>
                            Ticket ID: {item.ticket_id} - Total: ${item.total} - Fecha: {new Date(item.fecha).toLocaleString()}
                        </Text>
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => cancelTicket(item.ticket_id)}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewButton} onPress={() => viewTicketContent(item)}>
                                <Text style={styles.viewButtonText}>Ver Contenido</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <View style={styles.separator} />
            <Text style={styles.title}>Tickets Cancelados</Text>
            <FlatList
                data={cancelledTickets}
                keyExtractor={(item) => item.ticket_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.ticketItem}>
                        <Text style={styles.ticketText}>
                            Ticket ID: {item.ticket_id} - Total: ${item.total} - Fecha: {new Date(item.fecha).toLocaleString()}
                        </Text>
                        <TouchableOpacity style={styles.viewButton} onPress={() => viewTicketContent(item)}>
                            <Text style={styles.viewButtonText}>Ver Contenido</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            {selectedTicket && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Contenido del Ticket ID: {selectedTicket.ticket_id}</Text>
                            <Text>Total: ${selectedTicket.total}</Text>
                            <Text>Fecha: {new Date(selectedTicket.fecha).toLocaleString()}</Text>
                            <Text style={styles.productListTitle}>Productos:</Text>
                            {selectedTicket.productos.map(producto => (
                                <Text key={producto.producto_id}>
                                    - {producto.nombre} (ID: {producto.producto_id})
                                </Text>
                            ))}
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 20,
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    ticketItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e8e8e8",
    },
    ticketText: {
        fontSize: 16,
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginRight: 10, // Espacio entre los botones
    },
    cancelButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    viewButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    viewButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    separator: {
        height: 20,
        width: "100%",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    productListTitle: {
        fontWeight: "bold",
        marginTop: 10,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default Tickets;
