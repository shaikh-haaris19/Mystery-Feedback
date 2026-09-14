"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from '@/components/ui/toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { verifySchema } from '@/Schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { ApiResponse } from '@/Types/ApiResponse';

const VerifyEmailPage = () => {

  const searchParams = useSearchParams();
  const router = useRouter();

  const userName = searchParams.get("userName");


  // Zod schema for Form validation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema)
  })

  // Handle OTP submission
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {

    try {

      const response = await axios.post("/api/verify-otp", { otp: data.code, userName });

      console.log(response)

      if (response.data.success) {
        toast.add({
          title: "OTP verification successful",
          description: response.data.message,
          type: "success"
        })

        router.replace(`/sign-in`);
      } else {

        toast.add({
          title: "OTP verification failed",
          description: response.data.message,
          type: "error"
        })

      }

    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError.response?.data.message || "Error during OTP verification");

      toast.add({
        title: "OTP verification failed",
        description: axiosError.response?.data.message || "Error during OTP verification",
        type: "error"
      })

    }

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-2">

        <h1 className="text-center mb-5 text-4xl font-extrabold tracking-tight lg:text-5xl">Verify Your Email</h1>

        <form onSubmit={form.handleSubmit(onSubmit)}>

          <FieldGroup className="gap-7">

            {/* OTP */}
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">

                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="h-15 w-15 text-3xl border-2 border-black mx-1 mb-2 shadow-md"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-15 w-15 text-3xl border-2 border-black mx-1 mb-2 shadow-md"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-15 w-15 text-3xl border-2 border-black mx-1 mb-2 shadow-md"
                      />
                      <InputOTPSlot
                        index={3}
                        className="h-15 w-15 text-3xl border-2 border-black mx-1 mb-2 shadow-md"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-15 w-15 text-3xl border-2 border-black mx-1 mb-2 shadow-md"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-15 w-15 text-3xl border-2 border-black mx-1 mb-2 shadow-md"
                      />
                    </InputOTPGroup>
                  </InputOTP>

                </Field>
              )}
            />

          </FieldGroup>

          <div className="text-center text-sm">
            <p className="text-md text-gray-600 mb-8">
              Please enter the OTP sent to your email to verify your account.
            </p>
          </div>

          <div className="flex justify-center gap-5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="h-12 min-w-32 px-8 text-base border border-black"
            >
              Reset
            </Button>

            <Button
              type="submit"
              className="h-12 min-w-40 px-8 text-base"
            >
              Verify
            </Button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default VerifyEmailPage
