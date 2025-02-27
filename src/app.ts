import { Context, Telegraf, Scenes, session } from "telegraf";
import dotenv from "dotenv";
dotenv.config()
// ✅ Asegurar que la sesión incluye todo lo necesario
interface MyWizardSession extends Scenes.WizardSessionData {
    homeName?: string;
}

// ✅ Extender correctamente el contexto con `Scenes.WizardContext`
interface MyContext extends Scenes.WizardContext<MyWizardSession> { }

// Wizard para crear un nuevo hogar
const newHomeWizard = new Scenes.WizardScene<MyContext>(
    "newHomeWizard",
    async (ctx) => {
        await ctx.reply("¿Cuál es el nombre que le quieres dar a tu hogar 🏠?");
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message || !("text" in ctx.message)) {
            await ctx.reply("Por favor, envía un nombre válido para tu hogar.");
            return;
        }
        ctx.session.__scenes!.homeName = ctx.message.text;
        console.log(ctx.session.__scenes!.homeName)

        return ctx.scene.leave();
    }
);


// Configuración del bot
const bot = new Telegraf<MyContext>(process.env.BOT_TELEGRAM_API_KEY!);
const stage = new Scenes.Stage<MyContext>([newHomeWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx: Context) =>
    ctx.reply(
        "¡Hola! 👋🏡\n\nBienvenido/a a *CheckHome*, la app diseñada para hacer tu vida en casa más fácil. 🏠💡\n\n" +
        "¿Compartes gastos con tus compañeros de piso o familia? ¡No te preocupes! Aquí podrás:\n" +
        "✅ Llevar un control claro de los gastos.\n✅ Dividir cuentas de manera justa.\n✅ Evitar malentendidos y olvidos.\n\n" +
        "¡Empieza ahora y simplifica la gestión de gastos de tu hogar! 💰✨\n\n" +
        "¡Las cuentas claras y el 🍫 espeso!\n\nUsa /help si necesitas ayuda.\n\n¡Estoy aquí para ayudarte! 😊",
        { parse_mode: "Markdown" }
    )
);

bot.help((ctx: Context) =>
    ctx.reply(
        "📌 *Lista de comandos disponibles:*\n\n" +
        "/start - Inicia el bot y muestra el mensaje de bienvenida.\n" +
        "/help - Muestra esta lista de comandos.\n" +
        "/newhome - Crea un hogar para gestionar los gastos compartidos.\n" +
        "/newbuddy - Añade un compañero a la casa.\n" +
        "/newexpense - Añade un nuevo gasto (puedes subir un ticket o ingresar manualmente).\n" +
        "/viewbills - Muestra la lista de gastos registrados.\n" +
        "/balance - Muestra el balance actual entre los miembros.\n" +
        "/pay - Registra un pago entre miembros.\n" +
        "/mydebts - Muestra tus deudas pendientes.\n" +
        "/mypayments - Muestra tus pagos registrados.\n" +
        "/members - Gestiona los integrantes de la casa.\n" +
        "/config - Configura preferencias del bot.",
        { parse_mode: "Markdown" }
    )
);

// Comando para iniciar el proceso de crear un hogar
bot.command("newhome", (ctx) => ctx.scene.enter("newHomeWizard"));

bot.launch();

// Detener el bot de forma segura
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
