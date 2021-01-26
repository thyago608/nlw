import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    // Formatação da View que cobre a página
    container:{
        flex:1,
        backgroundColor: '#8257E5',
        justifyContent: 'center',
        padding: 40,
    },

    // Formatação da Imagem Banner
    banner:{
        width:'100%',
        resizeMode: 'contain'
    },

    // Formatação 1º parágrafo abaixo da Imagem-banner
    title:{
        fontFamily: 'Poppins_400Regular',
        color: '#FFF',
        fontSize: 20,
        lineHeight: 30,
        marginTop: 80,
    },
    // Formatação do segundo parágrafo
    titleBold:{
        fontFamily: 'Poppins_600SemiBold',
    },

    // Formatação da Caixa dos Botões
    buttonsContainer:{
        flexDirection:'row',
        marginTop: 40,
        justifyContent:'space-between'
    },

    // Formatação geral dos botões
    button:{
        height:150,
        width:'48%',
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 24,
        justifyContent: 'space-between',
    },

    buttonPrimary:{
        backgroundColor: '#9871f5',
    },

    buttonSecondary:{
        backgroundColor: '#04d361',
    },

    buttonText:{
        fontFamily: 'Archivo_700Bold',
        color: '#FFF',
        fontSize: 20,
    },

    totalConnections:{
        fontFamily:'Poppins_400Regular',
        fontSize: 12,
        lineHeight:20,
        maxWidth: 140,
        marginTop: 40,
        color: '#d4c2ff',
    }
    

});

export default styles;