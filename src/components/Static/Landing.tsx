import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen w-full" style={{backgroundImage: "url('/landing_background.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
            <nav className="flex justify-between w-full bg-white h-20 items-center px-24">
                <Link href={'/'}>
                    <Image src={'/logo.png'} width={108} height={108} alt=""/>
                </Link>
                <div className="flex text-black gap-12 items-center font-semibold">
                    <Link href={'/'} className="hover:underline-offset-4 hover:underline">Home</Link>
                    <Link href={'/'} className="hover:underline-offset-4 hover:underline">About</Link>
                    <Link href={'/'} className="hover:underline-offset-4 hover:underline">Contact Us</Link>
                    <Link href={'/login'} className="bg-ys text-white hover:border hover:border-black hover:bg-yellow-200 hover:text-black w-28 font-bold py-2 text-center rounded-3xl">Login</Link>
                </div>
            </nav>
            <div className="flex w-full min-h-[87.5vh] items-center pl-24">
                <div className="flex flex-col w-[80vh] gap-4">
                    <h1 className="text-ys text-[40px] font-bold">"No scholar left behind."</h1>
                    <p className="text-[18px] font-bold">Welcome to scholaRSerbisyo!<br/>Stay informed and engaged with our Event and Return Service Monitoring System</p>
                    <Link href={'/login'} className="bg-ys text-white hover:bg-yellow-200 hover:text-black text-[18px] w-44 font-bold py-3 text-center rounded-3xl">Get Started</Link>
                </div>
            </div>
        </div>
    )
}