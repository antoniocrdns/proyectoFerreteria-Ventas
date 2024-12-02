import React from 'react';
import { View, Button, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Load = () => {
    const navigation = useNavigation();

    const [isFullScreen, setIsFullScreen] = React.useState(false);

    const handleFullScreenAndNavigate = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        }
        navigation.navigate('Login');
    };
        
    return (
        <View style={styles.container}>
            <Button title="Go to App" onPress={handleFullScreenAndNavigate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default Load;
