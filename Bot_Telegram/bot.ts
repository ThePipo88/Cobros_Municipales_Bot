import {Telegraf} from 'telegraf'
import axios from 'axios';
import {user} from './dto/user';
import {parametro} from './dto/parametro';
import { cobroGenerado } from './dto/cobros';
import { cobroCancelado } from './dto/cobros';
import {MunicipalidadService} from './MunicipalidadService';

const bot = new Telegraf('2018669114:AAHCpvayz6uWRNTi_1hQEpFfb48-qu7lnVo')

var token: user;
var param: parametro;
var cobrosGenerados: Array<cobroGenerado>;
var cobrosCancelados: Array<cobroCancelado>;
var municipalidadService = new MunicipalidadService;
var initialToken = false;

function verificar(opc: number,parameters: string[], bot: Telegraf, chatId: number){
  var error = false;
  axios.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      const {
        config,
        response: { status, data }
      } = err;
      
      const originalRequest = config;
  
      if (status == 401 || data.message == "Unauthorized") {
        axios.post('http://localhost:8089/autenticacion',
      {
        cedula: "telegram",
        password: "Una2021"
      },
      {
        headers: {
           'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      var Ntoken = response.data as user;
      token.jwt = Ntoken.jwt;
      opcion(opc,Ntoken.jwt,parameters,bot,chatId);
      console.log('Token vencido, renovando nuevamente')
    })
    .catch(err => {
      console.log(err, err.response);
    });
    error = true;
      }
      else{
        opcion(opc,token.jwt,parameters,bot,chatId);
      }
    }
  );
  if(!error){
    opcion(opc,token.jwt,parameters,bot,chatId);
  } 
  error = false;
}


function opcion(opc: number, token: string, parameters: string[], bot: Telegraf, chatId: number){

  if(opc == 1){
    municipalidadService.formula(token, parameters, bot, chatId);
  }
  else if(opc == 2){
    municipalidadService.pendientes(token, parameters,1, bot, chatId,false);
  }
  else if(opc == 3){
    municipalidadService.pagos(token, parameters, bot, chatId);
  }
  else if(opc == 4){
    municipalidadService.horarios(token, parameters, bot, chatId);
  }
  else if(opc == 5){
    municipalidadService.telefonos(token, parameters, bot, chatId);
  }
  
}

function iniciar(){

  if(token == null){
    axios.post('http://localhost:8089/autenticacion',
      {
        cedula: "telegram",
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
      console.log('Token creado: '+token.jwt);
    })
    .catch(err => {
      console.log(err, err.response);
    });
  }
}

bot.command('start', async (cxt)=>{
iniciar();
cxt.reply('🤖Bienvenid@ '+cxt.from.first_name+', a continuación se le brindaran las diferentes opciones que puede consultar:\n\n'+
'a)Fórmula para el cálculo de un impuesto: ingresar el comando /formula y el tipo de impuesto a consultar:\n1.Ruta de buses\n2.Parques y Ornatos\n'+
'3.Limpieza de vías\n4.Derechos de cementerio\nPor ejemplo: /formula 2 \n\n'+
'b) Pendientes totales: ingresar el comando /pendientes más el número de cédula: \nPor ejemplo /pendientes 123456789\n\n'+
'c)Últimos pagos realizados: ingresar el comando /pagos más el número de cédula y dos rangos de fechas en los que se desea consultar estos pagos:\nPor ejemplo '+
'/pagos 123456789 2021-03-12 2021-07-21\n\n'+
'd)Horarios de atención: ingresar el comando /horarios para obtener los horarios de atención de la municipalidad\n\n'+
'e)Central telefónica: ingresar el comando /contactos para obtener el directorio de contactos telefónicos de la municipalidad');
})


bot.command('/formula', async (cxt)=>{
  var msg = cxt.message.text;
  var msgArray = msg.split(' ');
  verificar(1,msgArray,bot, cxt.from.id) 
})

bot.command('/pendientes', async (cxt)=>{
  var msg = cxt.message.text;
  var msgArray = msg.split(' ');
  verificar(2,msgArray,bot, cxt.from.id) ;
})

bot.command('/pagos', async (cxt)=>{  
  var msg = cxt.message.text;
  var msgArray = msg.split(' ');
  verificar(3,msgArray,bot, cxt.from.id);
})

bot.command('/horarios', async (cxt)=>{
  var msg = cxt.message.text;
  var msgArray = msg.split(' ');
  verificar(4,msgArray,bot, cxt.from.id);
})

bot.command('/contactos', async (cxt)=>{
  var msg = cxt.message.text;
  var msgArray = msg.split(' ');
  verificar(5,msgArray,bot, cxt.from.id);
})

bot.launch()