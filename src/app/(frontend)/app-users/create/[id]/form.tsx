"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X, Upload, Link } from "lucide-react"
import { enum_app_users_role } from "@/payload-generated-schema";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
	id: z.string(),
	role: z.string(),	
  email: z.string().email({ message: "Entrez une adresse mail valide" }),
  password: z.string().min(10, { message: "Le mot de passe doit comporter au moins 10 caractères" }),
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  firstName: z.string().min(1, { message: "Le prénom est requis" }),
  phone: z.string().min(10, { message: "Entrez un numéro de téléphone valide" }),
  image: z.any().optional(),
})


export default function FormPage({ email, id, role }: { email: string, id: string, role: string }) {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
			id,
			role,
      email,
      password: "",
      lastName: "",
      firstName: "",
      phone: "",
      image: null,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    // Reset the file input
    const fileInput = document.getElementById("profile-image") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // This would be replaced with your actual API call
      console.log("Form submitted with:", values)
      console.log("Image:", imagePreview)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to success page or dashboard
      // router.push("/registration-success")
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md py-8 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complétez votre inscription</CardTitle>
          <CardDescription>Veuillez remplir vos informations pour finaliser votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs text-red-500">* </p>
            <p className="text-xs text-black">Champs obligatoires</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground/50">Email <span className="text-red-500/50">*</span></FormLabel>
                    <FormControl>
                      <Input disabled placeholder="votre.email@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>Au moins 10 caractères</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+33 6 12 34 56 78" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de profil</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center space-y-4">
                        {imagePreview ? (
                          <div className="relative size-24">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Aperçu du profil"
                              fill
                              className="rounded-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : 
                         null
                        }
                        <Input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e)
                            field.onChange(e.target.files?.[0] || null)
                          }}
                          className={imagePreview ? "hidden" : ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Finaliser l'inscription"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
