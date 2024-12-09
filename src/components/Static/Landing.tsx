import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
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
          clipPath: 'polygon(100% 0, 35% 0, 100% 65%)',
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
      <div className="relative z-30 container mx-auto px-14 py-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-ys leading-tight">
                “No scholar left behind.”
            </h1>
            <div className="space-y-2 text-white">
              <p className="text-xl font-semibold">Welcome to SCHOLARSERBISYO!</p>
              <p className="text-lg opacity-90 max-w-md">
                Stay informed and engaged with our Return Service Monitoring System
              </p>
            </div>
            <div>
                <Link
                    href={'/login'}
                    className="bg-[#f5a524] hover:bg-yellow-300 text-white font-semibold px-8 py-3 text-lg rounded-full"
                >
                Get Started
                </Link>
            </div>
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

