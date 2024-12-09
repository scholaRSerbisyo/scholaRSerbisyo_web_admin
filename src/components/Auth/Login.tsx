"use client";

import * as React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { signIn } from "@/auth/auth";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { PasswordInput } from '../ui/password-input';

const formSchema = z.object({
    email: z.string().min(2).max(50).email({
        message: 'This field must be email',
    }),
    password: z.string().min(5, {
        message: 'Password must be at least 5 characters.',
    }).max(50),
})

export default function LoginForm() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const data = {
            email: values.email,
            password: values.password
        }

        const res = await signIn(data);

        if (res?.dt.status == 404 || res?.dt.status == 400 || res?.dt.status == 401 || res?.dt.status == 401) {
            toast({
                title:'Something went wrong',
                description: res?.dt.message,
            })
        } else {
            toast({
                title:'Success',
                description: res?.dt.message,
            })
        }
        
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <Image
            src="/landing_background.png"
            alt="Graduates celebrating"
            fill
            className="object-cover"
            priority
            />
        </div>

        {/* Top Right Diagonal */}
        <div 
            className="absolute top-0 right-0 w-full h-full z-10"
            style={{
            clipPath: 'polygon(100% 0, 35% 0, 100% 62%)',
            backgroundColor: '#f5a524'
            }}
        />
        <div 
            className="absolute top-0 right-0 w-full h-full z-20"
            style={{
                clipPath: 'polygon(100% 0, 46% 0, 100% 60%)',
            backgroundColor: 'white'
            }}
        />
        <div 
            className="absolute top-0 right-0 w-full h-full z-20"
            style={{
                clipPath: 'polygon(100% 0, 56% 0, 100% 66%)',
            backgroundColor: '#1a1f4d'
            }}
        />

        {/* Bottom Right Diagonal */}
        <div 
            className="absolute bottom-0 right-0 w-full h-full z-10"
            style={{
            clipPath: 'polygon(100% 100%, 36% 100%, 100% 33%)',
            backgroundColor: '#f5a524'
            }}
        />
        <div 
            className="absolute bottom-0 right-0 w-full h-full z-20"
            style={{
                clipPath: 'polygon(100% 100%, 47% 100%, 100% 35%)',
            backgroundColor: 'white'
            }}
        />
        <div 
            className="absolute bottom-0 right-0 w-full h-full z-20"
            style={{
                clipPath: 'polygon(100% 100%, 57% 100%, 100% 27%)',
            backgroundColor: '#1a1f4d'
            }}
        />

        {/* Content */}
        <div className="relative z-30 container mx-auto px-32 py-12 min-h-screen flex items-center">
            <div className="grid lg:grid-cols-2 gap-80 items-center">
            {/* Left Content */}
                <div className="flex justify-start">
                    <Toaster />
                    <Form {...form}>
                        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                            <Card className="max-w-5xl bg-black bg-opacity-50 border-none">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Login</CardTitle>
                                <CardDescription>
                                Enter your email below to login to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-white">
                                {/* Email Form Field */}
                                <FormField
                                control={form.control}
                                name='email'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl bg-white text-black" placeholder="example@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                {/* Password Form Field */}
                                <FormField
                                control={form.control}
                                name='password'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            {/* <Input className="rounded-xl bg-white text-black" placeholder="********" type="password" {...field} /> */}
                                            <PasswordInput placeholder='***********' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button className="w-full bg-ys text-black hover:bg-yellow-200 font-semibold" type="submit">Sign in</Button>
                                <Link href={"/forgot"} className="flex flex-row hover:underline hover:underline-offset-4 text-ys" >
                                    <p>Forgot Password? </p>
                                </Link>
                                <Link href={'/'} className="font-semibold text-red-500 px-6 rounded-md hover:border-x-2 hover:border-red-500">Go Back</Link>
                            </CardFooter>
                            </Card>
                        </form>
                    </Form>
                </div>
            {/* Right Content - Logo */}
            <div className="flex justify-end items-center">
                <div className="relative">
                {/* Navy blue ring */}
                <div className="absolute inset-0 bg-[#f5a524] rounded-full scale-[1.08] border border-[#f5a524]" />
                    {/* White background */}
                    <div className="relative bg-white rounded-full p-8 w-60 h-60 flex items-center justify-center">
                        <Image
                            src="/logo_transparent.png"
                            alt="Graduates celebrating"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}