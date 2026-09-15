"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/toast"
import { signUpSchema } from "@/Schemas/signUpSchema"
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/Types/ApiResponse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Loader2 } from "lucide-react"

const Login = () => {

  const router = useRouter()

  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUserName, 500);

  // Zod schema for Form validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    }
  })

  // Check username uniqueness when the debounced username changes
  useEffect(() => {

    const checkUsernameUniqueness = async () => {

      if (userName) {

        setIsCheckingUserName(true);
        setUserNameMessage("");

        try {

          const response = await axios.get(`/api/check-username-uniqueness?userName=${userName}`);

          const message = response.data.message;

          setUserNameMessage(message);
          setIsCheckingUserName(false);

        } catch (error) {

          const axiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(axiosError.response?.data.message || "Error checking username uniqueness");

        } finally {

          setIsCheckingUserName(false);

        }

      }

    }

    checkUsernameUniqueness();

  }, [userName])


  // Handle form submission
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

    setIsSubmitting(true);

    try {

      const response = await axios.post("/api/SignUp", data);

      if (response.status === 201) {

        toast.add({
          title: "Sign-up successful",
          description: response.data.message,
          type: "success"
        })

        router.replace(`/verify-otp?userName=${data.userName}`);

      }else{

        toast.add({
          title: "Sign-up failed! Please try again.",
          description: response.data.message,
          type: "error"
        })

      }

    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError.response?.data.message || "Error during sign-up");

      toast.add({
        title: "Sign-up failed! Please try again.",
        description: axiosError.response?.data.message || "Error during sign-up",
        type: "error"
      })

    } finally {
      setIsSubmitting(false);
    }

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">

        <Card className="w-full max-w-lg">

          <CardHeader>

            <CardTitle className="text-3xl font-semibold text-center">Sign-Up</CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              Sign up to start Your anonymous Feedback Journey.
            </CardDescription>

          </CardHeader>

          <CardContent className="px-8 pb-6">

            <form
              className="space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="gap-7">

                {/* Username */}
                <Controller
                  name="userName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">

                      <FieldLabel
                        htmlFor={field.name}
                        className="text-base font-medium"
                      >
                        UserName
                      </FieldLabel>

                      <div className="relative">
                        <Input
                          {...field}
                          id={field.name}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your username"
                          autoComplete="username"
                          className="h-12 px-4 text-base pr-10"
                        />

                        {isCheckingUserName && (
                          <Loader2 className="animate-spin"
                          />
                        )}
                      </div>

                      <p className={`text-sm ${userNameMessage === "Username Is Unique" ? "text-green-500" : "text-red-500"}`}>
                        {userNameMessage}
                      </p>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />

                {/* Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">

                      <FieldLabel
                        htmlFor={field.name}
                        className="text-base font-medium"
                      >
                        Email
                      </FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-12 px-4 text-base"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">

                      <FieldLabel
                        htmlFor={field.name}
                        className="text-base font-medium"
                      >
                        Password
                      </FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        className="h-12 px-4 text-base"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />

              </FieldGroup>

              {/* Buttons */}
              <div className="flex justify-center gap-5 pt-2">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                  className="h-12 min-w-32 px-8 text-base"
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 min-w-40 px-8 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing Up...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

              </div>

            </form>

          </CardContent>

        </Card>

      </div>

    </div>
  )
}

export default Login
