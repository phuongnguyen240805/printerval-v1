// src/server/routers/userRouter.ts
import { medusaClient } from "@/lib/medusaClient";
import { publicProcedure } from "../../trpc";
import z from "zod";
import Medusa from "@medusajs/js-sdk";

const MEDUSA_BASE =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const userRouter = {
  registerUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        sex: z.string().optional(),
        avatar: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { firstName, lastName, email, password, sex, avatar } = input;

      let authToken: string;

      // Medusa JS SDK client cho request này
      const requestClient = new Medusa({
        baseUrl: MEDUSA_BASE,
      });

      // BƯỚC 1: Đăng ký auth identity (registration token)
      // /auth/customer/emailpass/register [[Register route](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#register-route)]
      try {
        const registerResponse = await requestClient.auth.register(
          "customer",
          "emailpass",
          {
            email,
            password,
          }
        );

        // Theo JS SDK, register trả về string token [[JS SDK auth.register](https://docs.medusajs.com/resources/references/js-sdk/auth/register#register---js-sdk-auth-reference)]
        authToken =
          typeof registerResponse === "string"
            ? registerResponse
            : (registerResponse as any)?.token;

        if (!authToken) {
          throw new Error("No token received from registration");
        }
      } catch (error: any) {
        // Nếu identity đã tồn tại, thử login để lấy login token
        // /auth/customer/emailpass [[Auth route](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#login-route)]
        if (
          error.statusText === "Unauthorized" ||
          error.message?.includes("already exists")
        ) {
          try {
            const loginResponse = await requestClient.auth.login(
              "customer",
              "emailpass",
              {
                email,
                password,
              }
            );

            authToken =
              typeof loginResponse === "string"
                ? loginResponse
                : (loginResponse as any)?.token;

            if (!authToken) {
              throw new Error("No token received from login");
            }
          } catch (loginError: any) {
            throw new Error(`Failed to authenticate: ${loginError.message}`);
          }
        } else {
          throw new Error(`Registration failed: ${error.message}`);
        }
      }

      // BƯỚC 2: Tạo customer profile qua Storefront API
      // POST /store/customers với Bearer {registration/login token} + x-publishable-api-key [[Store PostCustomers](https://docs.medusajs.com/api/store#postcustomers)]
      try {
        const response = await fetch(`${MEDUSA_BASE}/store/customers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "x-publishable-api-key": PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            // Lưu field mở rộng vào metadata (cách docs cho phép lưu custom key-value) [[Store PostCustomers](https://docs.medusajs.com/api/store#postcustomers)]
            metadata: {
              sex,
              avatar,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();

          // Nếu customer đã tồn tại (trường hợp hiếm khi dùng đúng flow),
          // có thể coi là success tuỳ logic của bạn
          if (response.status === 409) {
            return { success: true, existed: true };
          }

          throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        return {
          success: true,
          customer: data.customer,
        };
      } catch (error: any) {
        throw new Error(
          `Error creating customer profile: ${error.message ?? error}`
        );
      }
    }),

  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // /auth/customer/emailpass [[Auth route](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#login-route)]
        const token = await medusaClient.auth.login(
          "customer",
          "emailpass",
          input
        );
        console.log("check token: ", token)
        // Medusa v2: login trả về string JWT [[Auth flow basic](https://docs.medusajs.com/resources/commerce-modules/auth/auth-flows#auth-flow-1-basic-authentication)]
        return token;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message;
        if (msg?.includes("Invalid email or password")) {
          throw new Error("Invalid email or password");
        }
        throw new Error("Login failed");
      }
    }),

  userDetail: publicProcedure
    .input(z.object({ accessToken: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.accessToken) {
        throw new Error("Unauthorized: missing token");
      }

      try {
        const queryParams = new URLSearchParams({
          "fields": "+metadata"
        });
        // GET /store/customers/me với Bearer customer token + publishable key [[Store customer.me](https://docs.medusajs.com/resources/references/js-sdk/store/customer#customer---js-sdk-store-reference)]
        const response = await fetch(`${MEDUSA_BASE}/store/customers/me?${queryParams.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${input.accessToken}`,
            "x-publishable-api-key": PUBLISHABLE_KEY,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch customer: ${response.status}`);
        }

        const data = await response.json();
        // sex & avatar sẽ nằm trong customer.metadata.sex / customer.metadata.avatar
        return data.customer;
      } catch (err: any) {
        throw new Error("Unable to fetch user details");
      }
    }),
};