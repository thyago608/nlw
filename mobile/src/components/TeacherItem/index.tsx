import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {View,Text, Image, Linking} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';

export interface Teacher{
    avatar: string;
    bio: string;
    id: number;
    cost: Number;
    name:string;
    subject:string;
    whatsapp:string;
}

interface TeacherItemProps{
    teacher: Teacher;
    favorited: boolean;
}

const TeacherItem:React.FC<TeacherItemProps> = ({teacher, favorited}) => {
 
    const [isFavorited, setIsFavorited] = useState(favorited);

    function handleLinkToWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`);
    }
    
 
/* 

    Em TeacherList é enviado para dentro de TeacherItem se o usuário está em um array de favoritos.
         [inicialmente é false]

     
    >>>> handleToggleFavorite => Função é disparada ao pressionar o botão de favorito.


    É buscado o valor que está na chave `favorites`. Caso exista info é convertido em um array de objetos.

    isFavorited => Guarda o estado se o teacherItem já está presente em um array de favoritos. 
                   Essa informação é obtida através da propriedade `favorited`
    
    
    isFavorited: true =>  




- Situações que TeacherList envia false em `favorited`
    1 - Não obter resposta em AsyncStorage, logo o array de `favorites` criado lá, retornará vazio.
        O array `favorites` teria o ID de todos os objetos teacher que estão no array presente em AsyncStorage




*/   
    async function handleToggleFavorite(){
        const favorites = await AsyncStorage.getItem('favorites');
        
        let favoritesArray = [];

        if( favorites){
            favoritesArray = JSON.parse(favorites);
        }

        if(isFavorited){
          const favoriteIndex = favoritesArray.findIndex((teacherItem:Teacher)=>{
              return teacherItem.id === teacher.id;
          });

          favoritesArray.splice(favoriteIndex, 1);

          setIsFavorited(false);
        }else{
            favoritesArray.push(teacher);

            setIsFavorited(true);
        }

        await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));


        /*
            Se o valor da propriedade `favorited` == false
            isFavorited também será false, já que o estado dessa variável é de acordo com o valor que for passado
            para a propriedade `favorited`.

            Logo é adicionado o objeto que for passado para a propriedade `teacher` no array `favoritedArray`.

            É o estado de de isFavorited irá para true.
            
            É adicionado na chave `favorites`, o array com o objeto atual convertido para string.
        
        

            >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            Como essa função é disparada quando pressionado o botão de 'favoritos', isso se reflete na
            exibição do TeacherItem. Pois de acordo com o estado de `isFavorited` é aplicado um css e um ícone.

        
        */
    }
    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image 
                style={styles.avatar} 
                source={{uri: teacher.avatar}}
                />
        
            <View style={styles.profileInfo}>
                <Text style={styles.name}>{teacher.name}</Text>
                <Text style={styles.subject}>{teacher.subject}</Text>
            </View>
            </View>
            <Text style={styles.bio}>
                {teacher.bio}
            </Text>

            <View style={styles.footer}>

                <Text style={styles.price}>Preço/hora{'   '}
                    <Text style={styles.priceValue}>R$ {teacher.cost},00</Text>
                </Text>
                
            <View style={styles.buttonsContainer}>
                
                <RectButton 
                    onPress={handleToggleFavorite}
                    style={
                        [styles.favoriteButton,
                        isFavorited ? styles.favorited :{}
                        ]}
                >
                        
                {isFavorited ? 
                <Image source={unfavoriteIcon} />
                :<Image source={heartOutlineIcon} /> 
                }
                </RectButton>

                <RectButton style={styles.contactButton} onPress={handleLinkToWhatsapp}>
                    <Image source={whatsappIcon} />
                    <Text style={styles.contactButtonText}>Entrar em contato</Text>
                </RectButton>
           
            </View>
            </View>
        </View>
    );
}

export default TeacherItem;