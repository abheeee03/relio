"use client"
import CopyButton from '@/components/Copybtn'
import { ThemeToggleButton } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { handelLogin } from '@/lib/actions'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

function page() {
    const [username, setUsername] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const [currActive, setCurrActive] = useState<"BTN" | "MODAL">("BTN")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    // useEffect(() => {
    //     const checkUser = async () => {
    //         const token = await getToken()
    //         if (token) {
    //             router.push('/home')
    //         }
    //     }
    //     checkUser()
    // }, [])

    return (
        <>
            <div className='h-screen tracking-tight w-full flex items-center justify-center'>
                {/* <ShaderGradientComponent /> */}
                <div className="absolute top-5 right-5">
                    <ThemeToggleButton start="top-down" variant="rectangle" />
                </div>
                <div className="absolute bottom-5 left-5">
                    {
                        currActive === "BTN" && <motion.div onClick={() => setCurrActive("MODAL")} layoutId='demo-account' className="relative bg-transparent border backdrop-blur-xl cursor-pointer rounded-xl px-5 py-5">
                            <motion.h1 layoutId='demo-head'>Use Demo Account</motion.h1>
                        </motion.div>
                    }
                    {
                        currActive === "MODAL" && <motion.div layoutId='demo-account' className='relative bg-transparent backdrop-blur-xl cursor-pointer border rounded-xl px-5 py-5 flex flex-col items-start justify-center gap-4'>
                            <div className="mb-3 flex w-full items-center justify-between">
                                <motion.h1 layoutId='demo-head'>Login Using Demo Account</motion.h1>
                                <Button onClick={() => setCurrActive("BTN")} variant={"ghost"}>
                                    <X size={15} />
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                Username:
                                <Input value={"abhee"} readOnly />
                                <CopyButton url='abhee' />
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                Password:
                                <Input value={"abhee"} readOnly />
                                <CopyButton url='abhee' />
                            </div>
                        </motion.div>
                    }
                </div>
                <Card className='bg-transparent backdrop-blur-xl'>
                    <CardTitle className='text-center font-semibold text-2xl'>
                        Login
                    </CardTitle>
                    <CardContent>
                        <form className="flex flex-col items-center justify-center gap-3">
                            <Input onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                            <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                            <Button type='submit' onClick={async (e) => {
                                e.preventDefault();
                                setIsLoading(true)
                                try {
                                    await handelLogin(username, password)
                                    router.push('/home');
                                    toast("Login Success")
                                } catch (err) {
                                    toast("Something went wrong");
                                    setIsLoading(false)
                                }
                            }} className='w-full' disabled={isLoading} >
                                {isLoading && <Spinner />} Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default page