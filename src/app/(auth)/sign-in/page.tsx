"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
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
import { signInSchema } from "@/Schemas/signInSchema"
import { signIn } from "next-auth/react"
import Image from "next/image"

const Login = () => {

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zod schema for Form validation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })


  // Handle form submission
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {

    setIsSubmitting(true);

    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })

    console.log("Sign-In Result:", result);

    // Handle the result of the sign-in attempt
    if (result?.error) {

      toast.add({
        title: "SignIn failed! Please try again.",
        description: "Invalid Indentifier or Password",
        type: "error"
      })

    } else {

      toast.add({
        title: "Success",
        description: "Signed in successfully",
        type: "success"
      })

    }

    setIsSubmitting(false);

    if (result?.ok) {
      router.replace("/dashboard");
    }

  }

  const handleGitHubSignIn = async () => {

    setIsSubmitting(true);

    const result = await signIn("github", {
      callbackUrl: "/dashboard?githubSignIn=true",
      redirect: false
    });

    console.log("GitHub Sign-In Result:", result);

    // Handle the result of the GitHub sign-in attempt
    if (result?.error) {

      toast.add({
        title: "SignIn failed! Please try again.",
        description: "Error during GitHub sign-in",
        type: "error"
      })

    }

    setIsSubmitting(false);

    if (result?.ok && result?.url) {

      router.replace(result.url);

    }

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">

        <Card className="w-full max-w-lg">

          <CardHeader>

            <CardTitle className="text-3xl font-semibold text-center">Sign-In</CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              Sign In to start Your anonymous Feedback Journey.
            </CardDescription>

          </CardHeader>

          <CardContent className="px-8 pb-6">

            <form
              className="space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >

              <FieldGroup className="gap-7">

                {/* Identifier */}
                <Controller
                  name="identifier"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">

                      <FieldLabel
                        htmlFor={field.name}
                        className="text-base font-medium"
                      >
                        Unique Identifier
                      </FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Your Username or Email"
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
                        placeholder="Enter Your Password"
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
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

              </div>

              {/* Or Sign-In With GitHUb */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* GitHub Sign In */}
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full text-base"
                onClick={() => handleGitHubSignIn()}
              >
                <span className="mr-2"><Image width={20} height={20} src="/github-icon.webp" alt="GitHub" /></span>
                Continue with GitHub
              </Button>

            </form>

          </CardContent>

        </Card>

      </div>

    </div>
  )
}

export default Login
