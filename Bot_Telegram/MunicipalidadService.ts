import {Telegraf} from 'telegraf'
import axios from 'axios';
import {user} from './dto/user';
import {parametro} from './dto/parametro';
import { cobroGenerado } from './dto/cobros';
import { cobroCancelado } from './dto/cobros';
import { isNumericLiteral } from 'typescript';
import { report } from 'process';
import { Console } from 'console';



export class MunicipalidadService{

formula(token: string, parameters: string[], bot: Telegraf, chat: number){

    
      axios.get('http://localhost:8089/parametros/'+parameters[1], {headers: {    
        Authorization: 'bearer ' + token,
      }}).then(response => {
        var param = response.data as parametro;
        bot.telegram.sendMessage(chat,param.formula);
      })
      .catch(err => {
        console.log(err, err.response);
      });

  }

  pendientes(token: string, parameters: string[], bot: Telegraf, chat: number){

    axios.get('http://localhost:8089/cobrosGenerados/ByCobroCedula/'+parameters[1], {headers: {
    Authorization: 'bearer ' + token,
  }}).then(response =>{
    var total = 0;
    var cobrosGenerados = response.data as Array<cobroGenerado>;

    for(let entry of cobrosGenerados){
        bot.telegram.sendMessage(chat,'Contribuyente: '+entry.contribuyenteServicio.contribuyente.nombre+'\n'+
       'Cedula: '+entry.contribuyenteServicio.contribuyente.cedula+'\n'+
       'Servicio: '+entry.contribuyenteServicio.servicio.tipoServicio+'\n'+
       'Id del servicio: '+entry.contribuyenteServicio.servicio.id+'\n'+
       'Monto: '+entry.monto+' ₡'+'\n'+
       'Fecha de emision: '+entry.fechaCobro);

       total = total+ entry.monto;
       if(entry.id == cobrosGenerados[cobrosGenerados.length-1].id){
        setTimeout(() => {
            bot.telegram.sendMessage(chat,'Total por cancelar: '+total+' ₡');
        },1500);
       }
    }
  })
  .catch(err => {
    console.log('Error de Token');
  });

  }

pagos(token: string, parameters: string[], bot: Telegraf, chat: number){

    axios.get('http://localhost:8089/cobrosCancelados/ByCobroCedula/'+parameters[1]+'/'+parameters[2]+'/'+parameters[3], {headers: {
    Authorization: 'bearer ' + token,
   }}).then(response =>{
    //if (res.status >= 400 && res.status < 600) {
    var total = 0;
    var cobrosCancelados = response.data as Array<cobroCancelado>;

    for(let entry of cobrosCancelados){
        bot.telegram.sendMessage(chat,'Contribuyente: '+entry.cobroGenerado.contribuyenteServicio.contribuyente.nombre+'\n'+
      'Cedula: '+entry.cobroGenerado.contribuyenteServicio.contribuyente.cedula+'\n'+
      'Servicio: '+entry.cobroGenerado.contribuyenteServicio.servicio.tipoServicio+'\n'+
      'Id del servicio: '+entry.cobroGenerado.contribuyenteServicio.servicio.id+'\n'+
      'Monto cancelado: '+entry.cobroGenerado.monto+' ₡'+'\n'+
      'Fecha de cancelacion '+entry.fechaCreacion);
    }
  })
  .catch(err => {
    bot.telegram.sendMessage(chat,'Los datos ingresados son erroneos, por favor vuelva a intentarlo')
    console.log(err, err.response);
  });

  }
  
  informacion(token: string, parameters: string[], bot: Telegraf, chat: number){

    var i = 5;
    while(i < 7){
  
      axios.get('http://localhost:8089/parametros/'+i.toString(), {headers: {
      Authorization: 'bearer ' + token,
      }})
    .then(response => {
      var param = response.data as parametro;
      bot.telegram.sendMessage(chat,param.formula);
    })
    .catch(err => {
      console.log(err, err.response);
    });
      i++;
    } 

  }

}

