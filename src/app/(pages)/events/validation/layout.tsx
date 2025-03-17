import { fetchedUser } from '@/components/Static/_actions/useractions'
import { redirect } from 'next/navigation'

export default async function EventValidationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await fetchedUser()
  
  // Redirect if user is not authenticated or not an admin
  if (!user || !user.admin) {
    redirect('/')
  }

  return (
    <main>
      {children}
    </main>
  )
}

