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
        <>
            <nav className="flex justify-between w-full bg-white h-20 items-center px-24">
                <Link href={'/'}>
                    <Image src={'/logo.png'} width={108} height={108} alt=""/>
                </Link>
            </nav>
            <div style={{backgroundImage: "url('/login_background.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <div className="flex justify-start pl-24 py-[11.2vh]">
                    <Toaster />
                    <Form {...form}>
                        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
                            <Card className="w-full max-w-sm bg-black">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Login</CardTitle>
                                <CardDescription>
                                Enter your email below to login to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4  text-white">
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
            </div>
        </>
    )
}