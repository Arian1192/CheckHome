import dotenv from "dotenv";
import { Scenes, Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { UserInteractions } from "./Constants.ts/index.js";
import { inviteNewFellaWizard } from "./Scenes/inviteNewFellaWizard.js";
import { newBuddyJoinGroup } from "./Scenes/newBuddyJoinGroup.js";
import { newHomeWizard } from "./Scenes/newHomeWizard.js";
dotenv.config();
const bot = new Telegraf(process.env.BOT_TELEGRAM_API_KEY);
const wizardStage = new Scenes.Stage([]);
wizardStage.register(newHomeWizard);
wizardStage.register(inviteNewFellaWizard);
wizardStage.register(newBuddyJoinGroup);
bot.start((ctx) => ctx.reply("¡Hola! 👋🏡\n\nBienvenido/a a *CheckHome*, la app diseñada para hacer tu vida en casa más fácil. 🏠💡\n\n" +
    "¿Compartes gastos con tus compañeros de piso o familia? ¡No te preocupes! Aquí podrás:\n" +
    "✅ Llevar un control claro de los gastos.\n✅ Dividir cuentas de manera justa.\n✅ Evitar malentendidos y olvidos.\n\n" +
    "¡Empieza ahora y simplifica la gestión de gastos de tu hogar! 💰✨\n\n" +
    "¡Las cuentas claras y el 🍫 espeso!\n\nUsa /help si necesitas ayuda.\n\n¡Estoy aquí para ayudarte! 😊", { parse_mode: "Markdown" }));
bot.help(async (ctx) => {
    try {
        const chat = await ctx.getChat();
        const userId = ctx.from?.id;
        const user = await ctx.telegram.getChatMember(chat.id, userId);
        const userRole = user.status;
        let message = "📌 *Lista de comandos disponibles:*\n\n" +
            "/start - Inicia el bot y muestra el mensaje de bienvenida.\n" +
            "/help - Muestra esta lista de comandos.\n" +
            "/newexpense - Añade un nuevo gasto (puedes subir un ticket o ingresar manualmente).\n" +
            "/viewbills - Muestra la lista de gastos registrados.\n" +
            "/balance - Muestra el balance actual entre los miembros.\n" +
            "/pay - Registra un pago entre miembros.\n" +
            "/mydebts - Muestra tus deudas pendientes.\n" +
            "/mypayments - Muestra tus pagos registrados.\n";
        if (userRole === "creator" || userRole === "administrator") {
            message +=
                "\n👑 *Comandos de Administrador:*\n" +
                    "/newhome - Crea un hogar para gestionar los gastos compartidos.\n" +
                    "/newbuddy - Añade un compañero a la casa.\n" +
                    "/members - Gestiona los integrantes de la casa.\n" +
                    "/config - Configura preferencias del bot.";
        }
        await ctx.reply(message, { parse_mode: "Markdown" });
    }
    catch (error) {
        console.error("Error obteniendo el rol del usuario:", error);
        await ctx.reply("❌ Ocurrió un error al obtener tu rol. Intenta de nuevo.");
    }
});
wizardStage.hears(UserInteractions.NEW_HOME, (ctx) => ctx.scene.enter("newHomeWizard"));
wizardStage.hears(UserInteractions.NEW_BUDDY, (ctx) => ctx.scene.enter("inviteNewFellaWizard"));
wizardStage.on(message("new_chat_members"), async (ctx) => {
    const newMembers = ctx.message?.new_chat_members;
    if (newMembers) {
        for (const member of newMembers) {
            await ctx.reply(`¡Hola, ${member.first_name}! 👋🏡\n\n¡Bienvenido/a! 🎉\n\n` +
                "¡Es un placer tenerte en casa! 🏠💡\n\n" +
                "Vamos a guardar tu usuario y vincularlo al hogar para que gestiones tus gastos y puedas realizar pagos 😊", { parse_mode: "Markdown" });
        }
    }
    ctx.scene.enter("newBuddyJoinGroup");
});
bot.use(session());
bot.use(wizardStage.middleware());
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
