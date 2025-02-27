import { Currency, PrismaClient, Role } from "@prisma/client";
import { Scenes } from "telegraf";
import { SceneIDS } from "../Constants.ts/index.js";

const prisma = new PrismaClient();

const newHomeWizard = new Scenes.WizardScene<any>(
  SceneIDS.NEW_HOME_WIZARD,
  async (ctx) => {
    ctx.reply(
      "¡Vamos a crear un nuevo hogar! 🏡🔑\n\nPor favor, ingresa el nombre de tu hogar:"
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.homeName = ctx.message.text;
    ctx.reply(
      `¡Perfecto! El nombre de tu hogar es *${ctx.wizard.state.homeName}*.\n\nIngresa la dirección de tu hogar:`
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.homeAddress = ctx.message.text;
    await ctx.reply(
      `¡Genial! La dirección de tu hogar es *${ctx.wizard.state.homeAddress}*.\n\n`
    );
    await ctx.telegram.sendMessage(
      ctx.chat.id,
      "¿En qué moneda se manejarán los gastos?",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "USD",
                callback_data: "USD",
              },
              {
                text: "EUR",
                callback_data: "EUR",
              },
            ],
          ],
        },
      },
      { parse_mode: "HTML" }
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.callbackQuery) {
      ctx.wizard.state.homeCurrency = ctx.callbackQuery.data;
    } else {
      ctx.wizard.state.homeCurrency = "EUR";
      ctx.reply(
        "No seleccionaste una moneda, por lo que se utilizará la moneda por defecto: *EUR*.",
        { parse_mode: "Markdown" }
      );
    }
    await ctx.reply(
      `¡Entendido! Los gastos se manejarán en *${ctx.wizard.state.homeCurrency}*.`
    );
    await ctx.reply(
      `¡Hogar creado con éxito! 🎉\n\nNombre: *${ctx.wizard.state.homeName}*\nDirección: *${ctx.wizard.state.homeAddress}*\nMoneda: *${ctx.wizard.state.homeCurrency}*`,
      { parse_mode: "Markdown" }
    );
    const { username, first_name, last_name, id, language_code } = ctx.from;
    const { homeName, homeAddress, homeCurrency } = ctx.wizard.state;
    await prisma.$transaction(async (tx) => {
      try {
        const { id: homeId } = await tx.home.create({
          data: {
            homeName,
            homeAddress,
            homeCurrency: homeCurrency as Currency,
          },
        });

        const { id: userId } = await tx.user.create({
          data: {
            id,
            username,
            first_name,
            last_name,
            language_code,
          },
        });

        await tx.homeUser.create({
          data: { homeId, userId, role: Role.ADMIN },
        });
      } catch (error) {
        console.error(error);
        throw new Error("Error al crear el hogar.");
      }
    });

    await ctx.reply(
      `¡Listo! Ahora puedes agregar a los miembros de tu hogar con el comando /addmember.\n\nPor mi parte acabo de asignarte como administrador del hogar, por lo que solo tu podrás gestionar ciertas acciones dentro del hogar.`
    );
    return ctx.scene.leave();
  }
);

export { newHomeWizard };
