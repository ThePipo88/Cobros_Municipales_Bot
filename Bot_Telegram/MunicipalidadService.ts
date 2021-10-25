import {Telegraf} from 'telegraf'
import axios from 'axios';
import {user} from './dto/user';
import {parametro} from './dto/parametro';
import { cobroGenerado } from './dto/cobros';
import { cobroCancelado } from './dto/cobros';
import { isNumericLiteral } from 'typescript';
import { report } from 'process';
import { Console } from 'console';


var bn = false;

export class MunicipalidadService{

formula(token: string, parameters: string[], bot: Telegraf, chat: number){
 
      if(parameters[1] == '1' || parameters[1] == '2' || parameters[1] == '3' || parameters[1] == '4'){

        axios.get('http://localhost:8089/botTelegram/'+parameters[1], {headers: {    
        Authorization: 'bearer ' + token,
      }}).then(response => {
        var param = response.data as parametro;
        bot.telegram.sendMessage(chat,param.formula);
      })
      .catch(err => {
        console.log(err, err.response);
        bot.telegram.sendMessage(chat,'Lo sentimos, hubo un error, vuelva a intentarlo')
      });
      }
      else{
        bot.telegram.sendMessage(chat,'Los datos ingresados son erroneos, por favor vuelva a intentarlo')
      }
}

pendientes(token: string, parameters: string[], tipo: number, bot: Telegraf, chat: number, noPedientes: boolean){

    axios.get('http://localhost:8089/botTelegram/ByCobroCedula/'+parameters[1]+'/'+tipo.toString(), {headers: {
    Authorization: 'bearer ' + token,
  }}).then(response =>{
    var total = 0;
    var cobrosGenerados = response.data as Array<cobroGenerado>;
    var text = '';
    for(let entry of cobrosGenerados){
      text += this.valoresContenidos(tipo)+'\n\n';
       text += 'Contribuyente: '+entry.contribuyenteServicio.contribuyente.nombre+'\n'+
       'Cédula: '+entry.contribuyenteServicio.contribuyente.cedula+'\n'+
       'Id del servicio: '+entry.contribuyenteServicio.servicio.id+'\n'+
       'Monto: '+' ₡'+entry.monto+'\n'+
       'Fecha de emisión: '+entry.fechaCobro+'\n\n';

       total = total+ entry.monto;
       if(entry.id == cobrosGenerados[cobrosGenerados.length-1].id){
        text += 'Total por pagar: '+' ₡'+ total;
       }
    }

    if(text != ''){
      if(tipo+1 < 5){
        bot.telegram.sendMessage(chat,text);
        this.pendientes(token, parameters,tipo = tipo+1, bot, chat,true);
      }
      else{
        bot.telegram.sendMessage(chat,text);
      }
    }
    else{
      if(tipo+1 < 5){
         if(noPedientes){
          this.pendientes(token, parameters,tipo = tipo+1, bot, chat,true);
         }
         else{
          this.pendientes(token, parameters,tipo = tipo+1, bot, chat,false);
         }
      }
      else{
        if(!noPedientes){
          bot.telegram.sendMessage(chat,'El cliente consultado no posee pendientes')
        }
      }
    }
  })
  .catch(err => {
    console.log('Error de Token');
    bot.telegram.sendMessage(chat,'Lo sentimos, hubo un error en el sistema, vuelva a intentarlo')
  });
  
}

pagos(token: string, parameters: string[], bot: Telegraf, chat: number){

  var verificarFecha1 = parameters[2].length;
  var verificarFecha2 = parameters[3].length;

 if(verificarFecha1 == 10 && verificarFecha2 == 10){

    axios.get('http://localhost:8089/botTelegram/ByCobroBetweenCedulaAndFecha/'+parameters[1]+'/'+parameters[2]+'/'+parameters[3], {headers: {
    Authorization: 'bearer ' + token,
   }}).then(response =>{
    var total = 0;
    var cobrosCancelados = response.data as Array<cobroCancelado>;
    var text = '';
    for(let entry of cobrosCancelados){
      text += 'Contribuyente: '+entry.cobroGenerado.contribuyenteServicio.contribuyente.nombre+'\n'+
      'Cédula: '+entry.cobroGenerado.contribuyenteServicio.contribuyente.cedula+'\n'+
      'Servicio: '+this.valoresContenidos(Number(entry.cobroGenerado.contribuyenteServicio.servicio.tipoServicio))+'\n'+
      'Id del servicio: '+entry.cobroGenerado.contribuyenteServicio.servicio.id+'\n'+
      'Monto cancelado: '+' ₡'+entry.cobroGenerado.monto+'\n'+
      'Fecha de cancelación: '+entry.fechaCreacion+'\n\n';
    }

    if(text != ''){
      bot.telegram.sendMessage(chat,text);
    }
    else{
      bot.telegram.sendMessage(chat,'El cliente consultado no posee cobros cancelados entre las fechas dadas');
    }

  })
  .catch(err => {
    bot.telegram.sendMessage(chat,'Lo sentimos, hubo un error en el sistema, vuelva a intentarlo')
    console.log(err, err.response);
  });
 }
 else{
  bot.telegram.sendMessage(chat,'Los datos ingresados son erroneos, por favor vuelva a intentarlo')
 }
}
  
horarios(token: string, parameters: string[], bot: Telegraf, chat: number){

      axios.get('http://localhost:8089/botTelegram/5', {headers: {
      Authorization: 'bearer ' + token,
      }})
    .then(response => {
      var param = response.data as parametro;
      bot.telegram.sendMessage(chat,param.formula);
    })
    .catch(err => {
      console.log(err, err.response);
    });

  }

telefonos(token: string, parameters: string[], bot: Telegraf, chat: number){

    axios.get('http://localhost:8089/botTelegram/6', {headers: {
    Authorization: 'bearer ' + token,
    }})
  .then(response => {
    var param = response.data as parametro;
    bot.telegram.sendMessage(chat,param.formula);
  })
  .catch(err => {
    console.log(err, err.response);
  });
 }

 
  valoresContenidos(opc: number) {
    var servicio = '';
  
    if(opc == 1){
     servicio = 'Ruta de buses';
    }else if(opc == 2){
      servicio = 'Parques y Ornatos';
    }else if(opc == 3){
      servicio = 'Limpieza de vías';
    }else if(opc == 4){
      servicio = 'Derechos de cementerio';
    }
  
    return servicio;
   }

}

