import * as React from "react";
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

const Tickets = () => {
    const [tickets, setTickets] = React.useState([]);
    const [productos, setProductos] = React.useState([]);  // Estado para los productos
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [allLoaded, setAllLoaded] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedTicket, setSelectedTicket] = React.useState(null);


    const [showCancelModal, setShowCancelModal] = React.useState(false);
    const [ticketToCancel, setTicketToCancel] = React.useState(null);

    const obtenerProductos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/productos');
            setProductos(response.data.filter(producto => producto.activo)); 
        } catch (error) {
            console.error("Error fetching products:", error);
            Alert.alert("No se pudieron cargar los productos.");
            alert("No se pudieron cargar los productos.");  // Versión para navegador
        }
    };


    React.useEffect(() => {
        obtenerProductos();
        getTickets(page);
    }, []);

    const getTickets = async (page) => {
        if (loading || allLoaded) return;
        setLoading(true);

        try {
            const response = await axios.get(`http://127.0.0.1:3000/api/tickets?page=${page}`);
            const newTickets = response.data.sort((a, b) => a.ticket_id - b.ticket_id);

            if (newTickets.length === 0) {
                setAllLoaded(true); // No hay más tickets para cargar
            } else {
                const uniqueTickets = [
                    ...tickets,
                    ...newTickets.filter(
                        ticket => !tickets.some(existing => existing.ticket_id === ticket.ticket_id)
                    ),
                ];
                setTickets(uniqueTickets);
                setPage(prevPage => prevPage + 1); // Incrementa la página para la siguiente carga
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
            Alert.alert("No se pudieron cargar los tickets.");
            alert("No se pudieron cargar los tickets.");  // Versión para navegador
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        getTickets(page);
    }, []);

    const viewTicketContent = (ticket) => {
        setSelectedTicket(ticket);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTicket(null);
    };

    // Función para abrir el modal de confirmación de cancelación
    const openCancelModal = (ticketId) => {
        setTicketToCancel(ticketId);
        setShowCancelModal(true);
    };

    // Función para confirmar la cancelación
    const confirmCancelTicket = async () => {
        try {
            await axios.delete(`http://127.0.0.1:3000/api/tickets/${ticketToCancel}`);
            Alert.alert("Ticket cancelado.");
            alert("Ticket cancelado.");  // Versión para navegador
            setTickets(tickets => tickets.map(ticket => 
                ticket.ticket_id === ticketToCancel ? { ...ticket, cancelada: 1 } : ticket
            ));
        } catch (error) {
            console.error("Error canceling ticket:", error);
            Alert.alert("No se pudo cancelar el ticket.");
            alert("No se pudo cancelar el ticket.");  // Versión para navegador
        } finally {
            setShowCancelModal(false);  // Cierra el modal después de la cancelación
        }
    };

    const crearTicket = async () => {
        if (productos.length === 0) {
            Alert.alert("No se pueden crear tickets", "Debe haber al menos un producto activo en el inventario.");
            alert("No se pueden crear tickets. Debe haber al menos un producto activo en el inventario.");  // Versión para navegador
            return;
        }

        try {
            const nuevoTicket = {
                total: calcularTotal(),
                productos: productos.map(producto => ({
                    producto_id: producto.id,
                    cantidad: 1,
                    precio_unitario: producto.precio
                }))
            };

            // Crear la venta (ticket)
            const response = await axios.post("http://127.0.0.1:3000/api/tickets", {
                total: nuevoTicket.total
            });

            const ventaId = response.data.id; // ID del ticket recién creado

            // Crear los detalles de la venta (productos dentro del ticket)
            await Promise.all(nuevoTicket.productos.map(async (producto) => {
                await axios.post("http://127.0.0.1:3000/api/detalle_venta", {
                    venta_id: ventaId,
                    producto_id: producto.producto_id,
                    cantidad: producto.cantidad,
                    precio_unitario: producto.precio_unitario
                });
            }));

            Alert.alert("Ticket creado con éxito.");
            alert("Ticket creado con éxito.");  // Versión para navegador
        } catch (error) {
            console.error("Error creating ticket:", error);
            Alert.alert("No se pudo crear el ticket.");
            alert("No se pudo crear el ticket.");  // Versión para navegador
        }
    };


    const renderTicketItem = ({ item }) => (
        <View style={styles.ticketItem}>
            <Text style={styles.ticketText}>
                Ticket ID: {item.ticket_id} - Total: ${item.total} - Fecha: {new Date(item.fecha).toLocaleString()}
            </Text>
            <View style={styles.buttonContainer}>
                {item.cancelada === 0 && (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => openCancelModal(item.ticket_id)}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.viewButton} onPress={() => viewTicketContent(item)}>
                    <Text style={styles.viewButtonText}>Ver Contenido</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderHeader = () => (
        <View>
            <Text style={styles.sectionTitle}>Tickets Activos</Text>
        </View>
    );

    const renderFooter = () => (
        tickets.some(ticket => ticket.cancelada === 1) && (
            <View>
                <Text style={styles.sectionTitle}>Tickets Cancelados</Text>
            </View>
        )
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tickets}
                keyExtractor={(item) => item.ticket_id.toString()}
                renderItem={({ item }) => 
                    item.cancelada === 0 ? renderTicketItem({ item }) : null
                }
                ListHeaderComponent={renderHeader}
                ListFooterComponent={
                    <>
                        <FlatList
                            data={tickets.filter(ticket => ticket.cancelada === 1)}
                            keyExtractor={(item) => `cancelled-${item.ticket_id}`}
                            renderItem={renderTicketItem}
                            ListHeaderComponent={renderFooter}
                        />
                        {!allLoaded && (
                            <TouchableOpacity style={styles.loadMoreButton} onPress={() => getTickets(page)}>
                                <Text style={styles.loadMoreButtonText}>{loading ? 'Cargando...' : 'Cargar más'}</Text>
                            </TouchableOpacity>
                        )}
                    </>
                }
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
                            <Text style={styles.datosT}>Total: ${selectedTicket.total}</Text>
                            <Text style={styles.datosT}>Fecha: {new Date(selectedTicket.fecha).toLocaleString()}</Text>
                            <Text style={styles.productListTitle}>Productos:</Text>
                            {selectedTicket.productos.map(producto => (
                                <Text style={styles.datosT} key={producto.producto_id}>
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
            {/* Modal para confirmar cancelación */}
            <Modal
                transparent={true}
                visible={showCancelModal}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>CONFIRMACIÓN DE ELIMINACIÓN</Text>
                        <Text style={styles.modalMessage}>¿Estás seguro de que deseas cancelar este ticket?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setShowCancelModal(false)} color="#d17609" />
                            <Button title="Confirmar" onPress={confirmCancelTicket} color="red" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#5c646b',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        padding: 20,
    },
    ticketItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
        borderRadius: 5,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    ticketText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
        marginRight: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    viewButton: {
        backgroundColor: '#d17609',
        padding: 8,
        borderRadius: 5,
    },
    viewButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loadMoreButton: {
        padding: 15,
        backgroundColor: '#d17609',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 20,
    },
    loadMoreButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#5c646b",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "white",
    },
    productListTitle: {
        fontWeight: "bold",
        marginTop: 10,
        color: "white",
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#d17609",
        fontWeight: "bold",
    },
    datosT:{
        color: "white",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        color: 'white',
        textAlign: "center"
    },
});

export default Tickets;
