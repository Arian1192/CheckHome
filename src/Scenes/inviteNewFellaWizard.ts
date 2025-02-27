import { Scenes } from "telegraf";
import { SceneIDS } from "../Constants.ts/index.js";

export const inviteNewFellaWizard = new Scenes.WizardScene<any>(
  SceneIDS.NEW_BUDDY_WIZARD,
  async (ctx) => {
    try {
      const chat = await ctx.getChat();
      const userId = ctx.from?.id;

      if (!userId) {
        console.error("No se pudo obtener el ID del usuario.");
        return ctx.scene.leave();
      }

      const user = await ctx.telegram.getChatMember(chat.id, userId);
      const userRole = user?.status;

      if (userRole !== "creator" && userRole !== "administrator") {
        await ctx.reply(
          "⚠️ ¡Ups! Este comando solo lo pueden usar administradores del grupo."
        );
        return ctx.scene.leave();
      }

      // Verificar si el usuario ha iniciado un chat con el bot
      try {
        await ctx.telegram.sendMessage(
          userId,
          "¡Vamos a invitar a un nuevo compañero de piso! 🏡👫"
        );
      } catch (error) {
        await ctx.reply(
          "Por favor, inicia un chat conmigo en privado para continuar."
        );
        return ctx.scene.leave();
      }

      const inviteLink = await ctx.telegram.createChatInviteLink(chat.id, {
        member_limit: 1,
        expire_date: Math.floor(Date.now() / 1000) + 3600,
      });

      await ctx.telegram.sendMessage(
        userId,
        `¡Listo! Aquí tienes el enlace mágico para invitar a un nuevo compañero de piso:\n\n` +
          `${inviteLink.invite_link} 🪄🔗\n\nEl link es válido solo por 1 hora.`
      );

      return ctx.scene.leave();
    } catch (error) {
      console.error("Error al generar el link de invitación:", error);
      await ctx.reply(
        "⚠️ Ocurrió un error al generar el enlace de invitación. " +
          "Por favor, verifica que soy administrador y tengo permisos suficientes."
      );
      return ctx.scene.leave();
    }
  }
);
