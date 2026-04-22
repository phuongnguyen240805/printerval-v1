import { medusaAdmin, medusaClient } from "@/lib/medusaClient";
import { get } from "http";
import { publicProcedure } from "../../trpc";

export const videoRouter = {
    getVideo: publicProcedure
        .query(async () => {
            const videos = await medusaAdmin.client.fetch("/admin/video", {
                method: "GET",
            });
            return videos;
        }),
};