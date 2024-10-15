"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { buttonVariants } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import Link from "next/link";

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

        toast({
            title:'Something went wrong',
            description: res?.message,
        })
    }

    return (
        <>
            <div className="flex justify-center px-5 py-24">
                <Toaster />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                            Enter your email below to login to your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {/* Email Form Field */}
                            <FormField
                            control={form.control}
                            name='email'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className="rounded" placeholder="example@gmail.com" {...field} />
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
                                        <Input className="rounded" placeholder="********" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button className="w-full" type="submit">Sign in</Button>
                            <Link href={"/forgot"} className="flex flex-row" >
                                <p className="font-bold">Forgot Password? </p>
                            </Link>
                        </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>
        </>
    )
}