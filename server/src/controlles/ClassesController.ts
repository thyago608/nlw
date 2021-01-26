import {Request, Response} from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController{
    //O método create será executado na página teacherForm

    // Método de criação de dados no banco.
    //O mesmo será chamado no método POST de Routes
    async create(request:Request, response:Response){
        
        //Está sendo utilizado o Destructing para extrair dados do objeto JSON 
        //que está sendo enviado na requisição.
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        }  = request.body;
    
        const trx = await db.transaction();
    
        try{
    
        /*
            Método insert(), permite inserir mais de uma informação por vez, ou seja, mais de um obj literal.
            O mesmo retorna uma lista com os id's adicionados.
        */
        const insertedUsersIds =  await trx('users').insert({
            name, 
            avatar,
            whatsapp,
            bio,      
        });
    
        //Está sendo capturado o id que está na posição 0.
        const user_id = insertedUsersIds[0];
    
        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id,
        });
    
        const class_id = insertedClassesIds[0];
    
        const classSchedule = schedule.map((scheduleItem:ScheduleItem) =>{
          return {
            class_id,
            week_day: scheduleItem.week_day,
            from: convertHourToMinutes(scheduleItem.from), 
            to: convertHourToMinutes(scheduleItem.to)
          };
        });
    
        await trx('class_schedule').insert(classSchedule);
    
    
        // Salvando as informações no banco
        await trx.commit();
        return response.status(201).send();
        //Código 201 -> Criado com sucesso
        
    }catch(err){
    
        /* O bloco try tentará ser executado, caso ocorra algum erro
           O método rollback() será executado, ou seja,
           as alterações feitas no banco de dados serão desfeitas.
        */ 
    
         await trx.rollback();
    
         /*
            Em caso de erro, é retornado o status 400 e um json com uma mensagem.
         */
         return response.status(400).json({
             error: 'Unexpected error while creating new class'
             //
         });
        }
    }




    // Método de recuperação de dados.
    // O mesmo será chamado no método GET de Routes
    async index(request:Request, response:Response){

        /* A Variável "filters" está recuperando os parâmetros que foram passados na requisição
           Parâmetros -> week_day, subject, time  */
           //O método index será executado na página TeacherList

        const filters = request.query;

        //Foi criado 3 variáveis para referênciar os valores que foram passados nos parâmetros da requisição
        // as string => Especifica que o valor que está no parâmetro week_day por exemplo é do tipo string.
        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;
        
        /* Se não existir valor em algum dos parâmetros.
           Será retornado um status 400 e uma mensagem em formato json */

        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: 'Missing filters to searh classes'
            });
        }

        /*
            É chamado a função que converte horas em minutos,
             para converter as horas que o usuário fornecer
        */
        const timeInMinutes = convertHourToMinutes(time);
        
        /*
          Está sendo recuperado todos os registros da tabela classes e users
          Onde o campo subject de classes for igual ao subject que o usuário passou na requisição
          E onde o campo user_id de users for igual ao users_id da tabela classes
          Ambos os registros tanto da tabela classes quanto users, serão juntados.

        */
        const classes = await db('classes')
        .whereExists(function(){
            this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
            .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
            .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject','=', subject)
        .join('users', 'classes.user_id','=','users.id')
        .select(['classes.*','users.*']);
       
        return response.json(classes);
    }
}