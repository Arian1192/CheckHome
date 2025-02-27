import { Context, Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

interface CheckHomeContext extends Context {

}

const bot = new Telegraf<CheckHomeContext>(process.env.BOT_TELEGRAM_APY_KEY!);

bot.start((ctx: Context) => ctx.reply('¡Hola! 👋🏡\n\nBienvenido/a a *CheckHome*, la app diseñada para hacer tu vida en casa mas facil. 🏠💡\n\n¿Compartes gastos con tus compañeros de piso o familia? ¡No te preocupes! Aquí podras:\n✅ Llevar un control claro de los gastos.\n✅ Dividir cuentas de manera justa.\n✅ Evitar malentendidos y olvidos.\n\n¡Empieza ahora y simplifica la gestión de gastos de tu hogar!  💰✨\n\n¡Las cuentas claras y el 🍫 espeso!\n\nUsa el comando /help si necesitas ayuda.\n\n¡Estoy aquí para ayudarte! 😊'))
bot.help((ctx: Context) => ctx.reply('Estos son los commandos mas relevantes de la apliación:\n\n/start - Inicia el bot y muestra el mensaje de bienvenida.\n/help - Muestra esta lista de comando disponibles\n/newhome - Crea un entorno de casa donde podras añadir despues integrantes para la gestion del hogar\n/newbuddy - Añadir a un compañero a la casa, si tienes varias casas te solicitaré a que casa quieres añadirlo.\n/newexpense - Añade un nuevo gasto. Puedes subir una foto del ticket o introducir los datos manualmente.\n/viewbills -  Muestra la lista de gastos registrados.\n/balance - Muestra el balance actual entre los miembros.\n/pay - Registra un pago entre miembros.\n/mydebts - Muestra tus deudas pendientes.\n/mypayments - Muestra tus pagos registrados.\n/members - Gestiona los integrantes de la casa.\n/config - Configura preferencias del bot.'))


// Create a new home
bot.command("newhome", (ctx: Context) => {

})


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))