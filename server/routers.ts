import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  items: router({
    list: publicProcedure.query(async () => {
      const { getAllItems } = await import("./db");
      return await getAllItems();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getItemById } = await import("./db");
        return await getItemById(input.id);
      }),
  }),

  pledges: router({
    create: publicProcedure
      .input(
        z.object({
          itemId: z.number(),
          fullName: z.string().min(2, "Full name is required"),
          email: z.string().email("Valid email is required"),
          cellNumber: z.string().min(10, "Valid cell number is required"),
          amount: z.number().positive("Amount must be positive"),
          isFull: z.boolean(),
          popiConsent: z.boolean().refine(val => val === true, "POPI consent is required"),
        })
      )
      .mutation(async ({ input }) => {
        const { getItemById, getPledgesByItemId, insertPledge, updateItemPledgeAmount } = await import("./db");
        
        // Get the item
        const item = await getItemById(input.itemId);
        if (!item) {
          throw new Error("Item not found");
        }
        
        // Check if item is locked
        if (item.isLocked === 1) {
          throw new Error("This item is already fully pledged");
        }
        
        // Calculate total price for the item (price * quantity)
        const totalItemPrice = item.price * item.quantity;
        
        // Get existing pledges
        const existingPledges = await getPledgesByItemId(input.itemId);
        const currentTotal = existingPledges.reduce((sum, p) => sum + p.amount, 0);
        
        // Validate amount
        const amountInCents = Math.round(input.amount * 100);
        const newTotal = currentTotal + amountInCents;
        
        if (newTotal > totalItemPrice) {
          throw new Error(`Amount exceeds remaining balance. Remaining: R${((totalItemPrice - currentTotal) / 100).toFixed(2)}`);
        }
        
        // Insert pledge
        const { pledgeNumber } = await insertPledge({
          itemId: input.itemId,
          fullName: input.fullName,
          email: input.email,
          cellNumber: input.cellNumber,
          amount: amountInCents,
          isFull: input.isFull ? 1 : 0,
          popiConsent: 1,
          emailSent: 0,
        });
        
        // Update item's total pledged amount and lock status
        const isNowLocked = newTotal >= totalItemPrice;
        await updateItemPledgeAmount(input.itemId, newTotal, isNowLocked);
        
        // Send confirmation email
        const { sendPledgeConfirmationEmail } = await import("./email");
        const emailSent = await sendPledgeConfirmationEmail({
          fullName: input.fullName,
          email: input.email,
          itemName: item.name,
          amount: input.amount,
          isFull: input.isFull,
          itemTotalPrice: totalItemPrice / 100,
          pledgeNumber,
        });
        
        // Update email status (we'll need the pledge ID, so let's get it)
        // Note: We need to modify this to get the inserted ID
        
        return {
          success: true,
          message: "Thank you for your pledge!",
          itemName: item.name,
          amount: amountInCents / 100,
          emailSent,
          pledgeNumber,
        };
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      // Only admin can view all pledges
      if (ctx.user.role !== 'admin') {
        throw new Error("Unauthorized");
      }
      const { getAllPledges } = await import("./db");
      return await getAllPledges();
    }),
  }),
});

export type AppRouter = typeof appRouter;
