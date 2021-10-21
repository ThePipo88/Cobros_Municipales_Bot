import {Telegraf} from 'telegraf'
import axios from 'axios';
import {user} from './dto/user';
import {parametro} from './dto/parametro';
import { cobroGenerado } from './dto/cobros';
import { cobroCancelado } from './dto/cobros';
import { isNumericLiteral } from 'typescript';
import { report } from 'process';

const bot = new Telegraf('2018669114:AAHCpvayz6uWRNTi_1hQEpFfb48-qu7lnVo')
var token: user;
var param: parametro;
var cobrosGenerados: Array<cobroGenerado>;
var cobrosCancelados: Array<cobroCancelado>;

function iniciar(){
    axios.post('http://localhost:8089/autenticacion',
      {
        cedula: "0123456789",
        password: "Una2021"
      },
      {
        headers: {
           'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      token = response.data as user;
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

bot.command('start', async (cxt)=>{
iniciar();
cxt.reply('🤖Bienvenid@, a continuacion se le brindaran las diferentes opciones que puede consultar:\n\n'+
'a)Formula para el calculo de un impuesto: ingresar el comando /formula y el tipo de impuesto a consultar:\n1.Ruta de buses\n2.Parques y Ornatos\n'+
'3.Limpieza de vias\n4.Derechos de cementerio\nPor ejemplo: /formula 2 \n\n'+
'b)Pendientes totales: ingresar el comando /pendientes mas el numero de cedula: \nPor ejemplo /pendientes 123456789\n\n'+
'c)Ultimos pagos realizados: ingresar el comando /pagos mas el numero de cedula y dos rangos de fechas en los que se desea consultar estos pagos:\nPor ejemplo '+
'/pagos 123456789 2021-03-12 2021-07-21\n\n'+
'd)Horarios y central telefonica: ingresar el comando /info para obtener los horarios de atencion y la central telefonica');
})

bot.command('/formula', async (cxt)=>{
  
  var msg = cxt.message.text;
  var msgArray = msg.split(' ');

  axios.get('http://localhost:8089/parametros/'+msgArray[1], {headers: {    
    Authorization: 'bearer ' + token.jwt,
 }})
  .then(response => {
    param = response.data as parametro;
    cxt.reply(param.formula);
  })
  .catch(err => {
    console.log(err, err.response);
  });
})

bot.command('/pendientes', async (cxt)=>{
  
  var msg = cxt.message.text;
  var msgArray = msg.split(' ');

  axios.get('http://localhost:8089/cobrosGenerados/ByCobroCedula/'+msgArray[1], {headers: {
    Authorization: 'bearer ' + token.jwt,
 }})
  .then(response =>{
    //if (res.status >= 400 && res.status < 600) {
    var total = 0;
    cobrosGenerados = response.data as Array<cobroGenerado>;

    for(let entry of cobrosGenerados){
       cxt.reply('Contribuyente: '+entry.contribuyenteServicio.contribuyente.nombre+'\n'+
       'Cedula: '+entry.contribuyenteServicio.contribuyente.cedula+'\n'+
       'Servicio: '+entry.contribuyenteServicio.servicio.tipoServicio+'\n'+
       'Id del servicio: '+entry.contribuyenteServicio.servicio.id+'\n'+
       'Monto: '+entry.monto+' ₡'+'\n'+
       'Fecha de emision: '+entry.fechaCobro);

       total = total+ entry.monto;
       if(entry.id == cobrosGenerados[cobrosGenerados.length-1].id){
        setTimeout(() => {
          cxt.reply('Total por cancelar: '+total+' ₡');
        },1500);
       }
    }
  })
  .catch(err => {
    console.log(err, err.response);
  });
})

bot.command('/pagos', async (cxt)=>{
  
  var msg = cxt.message.text;
  var msgArray = msg.split(' ');

  axios.get('http://localhost:8089/cobrosCancelados/ByCobroCedula/'+msgArray[1]+'/'+msgArray[2]+'/'+msgArray[3], {headers: {
    Authorization: 'bearer ' + token.jwt,
 }})
  .then(response =>{
    //if (res.status >= 400 && res.status < 600) {
    var total = 0;
    cobrosCancelados = response.data as Array<cobroCancelado>;

    for(let entry of cobrosCancelados){
      cxt.reply('Contribuyente: '+entry.cobroGenerado.contribuyenteServicio.contribuyente.nombre+'\n'+
      'Cedula: '+entry.cobroGenerado.contribuyenteServicio.contribuyente.cedula+'\n'+
      'Servicio: '+entry.cobroGenerado.contribuyenteServicio.servicio.tipoServicio+'\n'+
      'Id del servicio: '+entry.cobroGenerado.contribuyenteServicio.servicio.id+'\n'+
      'Monto cancelado: '+entry.cobroGenerado.monto+' ₡'+'\n'+
      'Fecha de cancelacion '+entry.fechaCreacion);
    }
  })
  .catch(err => {
    console.log(err, err.response);
  });
})

bot.command('/info', async (cxt)=>{

  var msg = cxt.message.text;
  var msgArray = '';
  var i = 5;

  while(i < 7){

    axios.get('http://localhost:8089/parametros/'+i.toString(), {headers: {
    Authorization: 'bearer ' + token.jwt,
    }})
  .then(response => {
    param = response.data as parametro;
    cxt.reply(param.formula);
  })
  .catch(err => {
    console.log(err, err.response);
  });
    i++;
  }
})

bot.launch()