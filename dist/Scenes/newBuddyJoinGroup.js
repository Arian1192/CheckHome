import { PrismaClient, Role } from "@prisma/client";
import { Scenes } from "telegraf";
import { SceneIDS } from "../Constants.ts/index.js";
const prisma = new PrismaClient();
export const newBuddyJoinGroup = new Scenes.WizardScene(SceneIDS.NEW_BUDDY_JOIN_GROUP, async (ctx) => {
    try {
        await ctx.reply("Estamos guardando tu información. Por favor, espera un momento...");
        const { username, first_name, last_name, id, language_code } = ctx.from;
        const chat = await ctx.telegram.getChat(ctx.chat.id);
        const telegramId = chat.id;
        await prisma.$transaction(async (tx) => {
            const home = await tx.home.findFirst({
                where: { telegramId },
            });
            if (!home) {
                await ctx.reply("⚠️ No se encontró un hogar asociado a este grupo. Por favor, crea un hogar primero.");
                return;
            }
            const user = await tx.user.upsert({
                where: { id },
                update: {},
                create: {
                    id,
                    username,
                    first_name,
                    last_name,
                    language_code,
                },
            });
            await tx.homeUser.create({
                data: {
                    userId: user.id,
                    homeId: home.id,
                    role: Role.MEMBER,
                },
            });
        });
        await ctx.reply("✅ Tu información ha sido guardada exitosamente.");
    }
    catch (error) {
        console.error("❌ Error en newBuddyJoinGroup:", error);
        await ctx.reply("⚠️ Ocurrió un error al procesar tu registro. Inténtalo de nuevo más tarde.");
    }
    finally {
        return ctx.scene.leave();
    }
});
