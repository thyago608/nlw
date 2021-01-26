import React,{useState} from 'react';
import {View, ScrollView,Text,TextInput} from 'react-native';
import {BorderlessButton, RectButton} from 'react-native-gesture-handler';
import PageHeader from '../../components/PageHeader';
import TeacherItem,{Teacher} from '../../components/TeacherItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Feather} from '@expo/vector-icons';
import api from '../../services/api';

import styles from './styles';

function TeacherList(){
    
    const [isFiltersVisible, setFiltersVisible] = useState(false); 
    
    const [teacher, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');


    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response =>{
            if(response){
                const favoritedTeachers = JSON.parse(response);

                const favoritedTeachersIds = favoritedTeachers.map((teacher:Teacher) =>{
                    return teacher.id;
                });
                setFavorites(favoritedTeachersIds);
            }
        });
    }

    /*
    
    Assim que o usuário pressionar 'filtrar' irá  ser recuperado proffy no BD de acordo com as informações fornecidas.
    Mas antes disso será executado loadFavorites()
    Que realiza uma busca pelo valor que estiver na chave 'favorites' em AsyncStorage.
    Caso exista algum valor a chave 'favorites', é convertido para um array de objs.
    É percorrido cada um dos objs que estão no array favoritedTeacher e capturando apenas o id de cada obj.
    FavoritedTeacherId => É um array com ids de teachers.
        
    */
  

    function handleToggleFiltersVisible(){
        setFiltersVisible(!isFiltersVisible);
    }

    async function hangleFiltersSubmit(){

        loadFavorites();   
    
        const response = await api.get('classes',{
            params:{
                subject,
                week_day,
                time,
            },
        });

        setFiltersVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader title="Proffys disponíveis" headerRight={(
                <BorderlessButton onPress={handleToggleFiltersVisible}>
                    <Feather name="filter" size={20} color="#FFF" />
                </BorderlessButton>
            )}>

                 
           { isFiltersVisible && (
                <View style={styles.searchForm}>
                    <Text style={styles.label}>Matéria</Text>
                    
                    <TextInput 
                       style={styles.input} 
                       placeholder="Qual a matéria?" 
                       placeholderTextColor="#c1bccc"
                       onChangeText={text => setSubject(text)}   
                    />

                    <View style={styles.inputGroup}> 
                        
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                            
                            <TextInput 
                                style={styles.input} 
                                placeholder="Qual o dia?" 
                                placeholderTextColor="#c1bccc"
                                onChangeText={text => setWeekDay(text)}       
                            />
                        </View>
                    
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Qual o horário?" 
                                placeholderTextColor="#c1bccc"
                                onChangeText={text => setTime(text)}   
                            />
                        </View>
                    </View>
                    <RectButton 
                        onPress={hangleFiltersSubmit}
                        style={styles.submitButton}
                    >
                        <Text style={styles.submitButtonText}>Filtrar</Text>
                    </RectButton>
                </View>


           )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal:16,
                    paddingBottom:16,
                }}
            >
                {
                    teacher.map((teacher:Teacher) => {
                        return (
                            <TeacherItem 
                                favorited={favorites.includes(teacher.id)} 
                                key={teacher.id} 
                                teacher={teacher}
                       />)
                    })
                }
            </ScrollView>
        </View>
    );
}

export default TeacherList;

/*
    É passado para a propriedade`favorited` do teacherItem atual o retorno da função includes. [retorno bool]
    Que irá verificar se o id do teacherItem atual está presente no array favorites.
    [favorites => É um array com ids de teachers]

*/