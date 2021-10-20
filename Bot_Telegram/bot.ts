import {Telegraf} from 'telegraf'
import axios from 'axios';
import {user} from './dto/user';
import {parametro} from './dto/parametro';
import { isNumericLiteral } from 'typescript';

const bot = new Telegraf('2018669114:AAHCpvayz6uWRNTi_1hQEpFfb48-qu7lnVo')
var token: user;
var param: parametro;

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

function formula(opc: number){
  axios.get('http://localhost:8089/parametros/'+opc, {headers: {
    Authorization: 'bearer ' + token.jwt,
 }})
  .then(response => {
    param = response.data as parametro;
    console.log(param.formula);
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
    cxt.reply(param.formula)
  })
  .catch(err => {
    console.log(err, err.response);
  });

})

bot.command('/pendientes', async (cxt)=>{
  cxt.reply('Pendientes');
})

bot.command('/pagos', async (cxt)=>{
  cxt.reply('Pagos');
})

bot.command('/info', async (cxt)=>{

})

bot.launch()