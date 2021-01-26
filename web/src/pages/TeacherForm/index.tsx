import React,{FormEvent, useState} from "react";
import {useHistory} from 'react-router-dom';
import PageHeader from "../../components/PageHeader";
import Textarea from "../../components/TextArea";
import Select from "../../components/Select";
import Input from '../../components/Input';
import warningIcon from '../../assets/images/icons/warning.svg';
import api from '../../services/api';
import './style.css';

function TeacherForm() {

  let count = 0;
  // Variáveis de estado para os inputs 'Seus dados'
  const [name, setName]  = useState('');
  const [avatar, setAvatar] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');

  // Variáveis de estado para o select 'Sobre a Aula'
  const [subject, setSubject] = useState('');
  const [cost, setCost] = useState('');


  const history = useHistory();

  // Variável de estado para criação de outro select caso o usuário clique no botão de +
  const [scheduleItem, setScheduleItem] = useState([{
    week_day: 0,
    from: '',
    to: '',
  }]);


  function addNewScheduleItem(){
    setScheduleItem([
      ...scheduleItem,
      {week_day: 0, from: '', to: ''}
    ]);
  }


  function handleCreateClass(e:FormEvent){
    
    e.preventDefault();
    
    api.post('/classes',{
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost:Number(cost),
      schedule:scheduleItem
    }).then(()=>{
      alert('Cadastro realizado com sucesso')
      history.push('/');
    }).catch(()=>{
      alert('Não foi possível realizar o cadastro')
    });

    console.log({
      name, 
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      scheduleItem
    });
  }


 //setScheduleItemValue(0, 'week_day', 3);
  function setScheduleItemValue(position: number, field:string, value:string){
    const updatedScheduleItems = scheduleItem.map((scheduleItem,index) =>{
      if(index === position){
        return { ...scheduleItem, [field]: value};
      }
      return scheduleItem;
    });
    setScheduleItem(updatedScheduleItems);
  }

  return (
    <div id="page-teacher-form" className="container">
      <PageHeader title="Que incrível que você quer dar aulas."
      description="O primeiro passo, é preencher esse formulário de inscrição" />
      <main>

      <form onSubmit={handleCreateClass} >
        <fieldset>
            <legend>Seus dados</legend>
            
            <Input 
            name="name"
            label="Nome Completo"
            value={name}
            onChange={(e)=>{setName(e.target.value)}}
            />
            
            <Input 
              name="avatar" 
              label="Avatar" 
              value={avatar} 
              onChange={(e)=>{ setAvatar(e.target.value)}}
            />
              
            <Input 
              name="whatsapp" 
              label="Whatsapp" 
              value={whatsapp} 
              onChange={(e)=>{setWhatsapp(e.target.value)}}
            />
            
            <Textarea 
              name="bio" 
              label="Biografia" 
              value={bio} 
              onChange={(e) =>{setBio(e.target.value)}}
            />
        </fieldset>

        <fieldset>
            <legend>Sobre a aula</legend>
            
            <Select 
            name="subject" 
            label="Matéria"
            value={subject}
            onChange={(e)=>{setSubject(e.target.value)}}
            
            options={[
              {value:'Artes', label:'Artes'},
              {value:'Biologia', label:'Biologia'},
              {value:'Ciências', label:'Ciências'},
              {value:'Educação Física', label:'Educação Física'},
              {value:'Física', label:'Física'},
              {value:'Geografia', label:'Geografia'},
              {value:'História', label:'História'},
              {value:'Matemática', label:'Matemática'},
              {value:'Português', label:'Português'},
              {value:'Quimíca', label:'Quimíca'},
            ]}
            />

            <Input
              name="cost"
              label="Custo da sua hora por aula"
              value={cost}
              onChange={(e)=>{setCost(e.target.value)}}
            />
        </fieldset>

        <fieldset>
            <legend>Horários disponíveis
            <button type="button" onClick={addNewScheduleItem}> + Novo Horário</button>
            </legend>

            {
              scheduleItem.map((item,index) =>{
                return (
                <div key={count++} className="schedule-item" >
                    <Select 
                     name="week_day" 
                     label="Dia da semana"
                     onChange= {e=> setScheduleItemValue(index, 'week_day', e.target.value)}
                     options={[
                      {value:'0', label:'Domingo'},
                      {value:'1', label:'Segunda-feira'},
                      {value:'2', label:'Terça-feira'},
                      {value:'3', label:'Quarta-feira'},
                      {value:'4', label:'Quita-feira'},
                      {value:'5', label:'Sexta-feira'},
                      {value:'6', label:'Sábado'}
                  ]}/>

                  <Input
                    name="from" 
                    label="Das" 
                    type="time"
                    value= {item.from}
                    onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                  />
                  
                  <Input
                    name="to" 
                    label="Até" 
                    type="time"
                    value={item.to}
                    onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                  /> 
                </div>)
              })
            }

        </fieldset>
        <footer>
            <p>
              <img src={warningIcon} alt="Aviso Importante"/>
              Importante !<br />
              Preencha todos os dados
            </p>
            <button type="submit">Salvar cadastro</button>
        </footer>
      </form>
      </main>
    </div>
  );

}

export default TeacherForm;
