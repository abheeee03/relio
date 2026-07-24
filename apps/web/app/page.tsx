"use client"

import Link from "next/link"
import localFont from 'next/font/local';
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { IoIosArrowRoundForward, IoLogoGithub } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import FeatureCards from "@/components/features";
import { useRouter } from "next/navigation";
import ArchCard from "@/components/ArchCard";
import { EffectScene } from "@/components/ascii-scene";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import SplitText from '@/components/SplitText'
import { motion } from 'motion/react'
import { ReactLenis } from 'lenis/react'

export const Ros = localFont({
  src: './RoslindaleDisplay.ttf',
  weight: "400",
  style: "normal"
})


const ArchInfo = [
  {
    title: "You Add It",
    description: "Drop your website link into Relio. No tech stress, no setup drama. Just add the URL and you’re good to go. We handle the rest behind the scenes."
  },
  {
    title: "We Check It",
    description: "Our global workers from different regions keep pinging your site to make sure it’s online, fast, and not acting weird. If your site blinks, we notice."
  },
  {
    title: "We Save It",
    description: "All the uptime, speed, and status data gets stored safely so you can track performance, spot issues, and stay in control like a pro."
  },
  {
    title: "We Alert You",
    description: "If something breaks, you’ll know instantly. Email, Slack, SMS — we make sure you’re never the last one to find out."
  }
];


export default function Landing() {

  const router = useRouter()
  return (
    <>
      <ReactLenis />
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] bg-black pointer-events-none"
      />
      <motion.nav
        initial={{
          opacity: 0,
          y: -1000
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 1,
          delay: 0.3
        }}
        className="w-full z-50 fixed px-4 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-4 sm:py-6 md:py-10">
        <div className="w-full border border-gray-800/25 rounded-xl px-2 py-2 backdrop-blur-sm flex items-center justify-between">
          <Logo />
          <div className="flex gap-3 items-center justify-center">
            <Button>
              <Link target="_blank" href={"https://github.com/abheeee03"}>
                <IoLogoGithub />
              </Link>
            </Button>
            <Button>
              <Link href={"https://x.com/_AbhayHere"}>
                <FaXTwitter />
              </Link>
            </Button>
            <Button className="py-3" onClick={() => {
              router.push('/login')
            }} size={"sm"}>
              Login
            </Button>
          </div>
        </div>
      </motion.nav>
      {/* Hero Section */}
      <div className="relative text-white h-screen w-full bg-[#000000]">
        <div className="absolute flex items-center justify-center flex-col bottom-0 left-0 right-0 top-0 px-4 sm:px-8 bg-[radial-gradient(180%_130%_at_45%_10%,rgba(255,255,255,0)_20%,rgba(94,47,218,1)_100%)]">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-10">
            <span className={`text-center ${Ros.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white`}>
              <SplitText className="py-1 sm:py-2 -m-2 sm:-m-5" text="Stay Online." /> <br />
              <SplitText className="py-1 sm:py-2" text="Stay Winning." />
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, animationDelay: 2 }}
            transition={{ duration: 2 }}
            className="flex flex-col items-center justify-center mt-6 sm:mt-10 px-4">
            <p className="text-base sm:text-lg md:text-xl text-center">Real-time uptime monitoring so <br className="hidden sm:block" /> you can chill while we watch your servers.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6 sm:mt-10">
              <Button onClick={() => {
                router.push('/login')
              }} size={"lg"} className="bg-white text-black hover:bg-white/90">
                Get Started <IoIosArrowRoundForward />
              </Button>
              <Button size={"lg"}>
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="min-h-screen w-full flex items-center text-black bg-[#412097] justify-center px-2 sm:px-3 py-10 sm:py-0">
        <div className="h-full w-full flex flex-col items-center justify-center border rounded-lg bg-white px-4 sm:px-6 md:px-10 py-10 sm:py-16">
          <div className="flex flex-col w-full items-center justify-center mb-5 text-center">
            <h4 className="text-lg sm:text-xl md:text-2xl">What Relio Actually Does</h4>
            <h1 className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl ${Ros.className}`}>Everything Your Site Needs.</h1>
          </div>
          <FeatureCards />
        </div>

      </div>

      <div className={`bg-[#412097] w-full text-center text-white text-shadow-black/10 text-shadow-lg tracking-tight h-full py-6 sm:py-10 px-4 ${Ros.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`}>How This Works?</div>
      <section className="bg-[#412097] w-full">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-screen hidden md:sticky top-0 md:flex items-center justify-center bg-[#412097]">
            <EffectScene />
          </div>

          <div className="min-h-[300vh] py-20 sm:py-32 md:py-50 px-4 sm:px-6 md:px-10 flex flex-col justify-between items-start z-10 bg-[#412097]">
            {ArchInfo.map((option, index) => (
              <ArchCard
                key={index}
                title={option.title}
                description={option.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* <div className="min-h-[50vh] md:h-1/2 bg-[#412097] text-black overflow-hidden w-full">
        <div className="h-full relative bg-white rounded-t-2xl sm:rounded-t-3xl overflow-hidden w-full flex flex-col md:flex-row items-start justify-start">
          <div className="w-full md:w-1/2 h-auto md:h-full z-10 flex items-center md:items-end justify-center md:justify-start py-8 md:py-0">
            <h1 className={`text-6xl sm:text-8xl md:text-[20vh] lg:text-[30vh] xl:text-[40vh] text-black/90`}>Relio</h1>
          </div>
          <div className="h-full w-full md:w-1/2 flex flex-col sm:flex-row items-start justify-center sm:justify-evenly gap-8 sm:gap-4 px-6 sm:px-10 py-8 md:py-0 md:mt-20">
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-5">Connect</h1>
              <div className="flex flex-col items-start justify-center gap-2 text-lg sm:text-xl">
                <AnimatedLink href={"mailto:contact@abhee.dev"} className="">Email</AnimatedLink>
                <AnimatedLink href={"https://abhee.dev"} className="">Website</AnimatedLink>
                <AnimatedLink href={"https://x.com/_AbhayHere"} className="">Twitter</AnimatedLink>
              </div>
            </div>
            <div className="flex items-start justify-center flex-col">
              <h1 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-5">Product</h1>
              <div className="flex flex-col items-start justify-center gap-2 text-lg sm:text-xl">
                <AnimatedLink href={"https://abhee.dev"} className="">Alerts</AnimatedLink>
                <AnimatedLink href={"https://abhee.dev"} className="">Dashboard</AnimatedLink>
                <AnimatedLink href={"https://abhee.dev"} className="">Integrations</AnimatedLink>
                <AnimatedLink href={"https://abhee.dev"} className="">Uptime Monitoring</AnimatedLink>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <main className='bg-black'>
        <div className='wrapper'>
          <section className='text-white h-screen w-full bg-slate-950  grid place-content-center sticky top-0'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0)_50%,_rgba(65,32,151,1)_92%)] flex items-center justify-center'></div>
            <div className={`text-8xl tracking-tight z-50 text-center ${Ros.className}`}>
              <h1>Your Site Has Trust Issues. </h1>
              <h1 className="mt-3"> We Fix That.</h1>
            </div>

          </section>

          <section className='bg-gray-300 py-10 text-black flex flex-col items-start justify-between md:h-screen h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
            <div className="w-full flex items-start justify-end px-10 gap-20">
              <div className="flex flex-col items-start justify-center">
                <h1 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-5">Connect</h1>
                <div className="flex flex-col items-start justify-center gap-2 text-lg sm:text-xl">
                  <AnimatedLink href={"mailto:contact@abhee.dev"} className="">Email</AnimatedLink>
                  <AnimatedLink href={"https://abhee.dev"} className="">Website</AnimatedLink>
                  <AnimatedLink href={"https://x.com/_AbhayHere"} className="">Twitter</AnimatedLink>
                </div>
              </div>
              <div className="flex items-start justify-center flex-col">
                <h1 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-5">Product</h1>
                <div className="flex flex-col items-start justify-center gap-2 text-lg sm:text-xl">
                  <AnimatedLink href={"https://abhee.dev"} className="">Alerts</AnimatedLink>
                  <AnimatedLink href={"https://abhee.dev"} className="">Dashboard</AnimatedLink>
                  <AnimatedLink href={"https://abhee.dev"} className="">Integrations</AnimatedLink>
                  <AnimatedLink href={"https://abhee.dev"} className="">Uptime Monitoring</AnimatedLink>
                </div>
              </div>
            </div>
            <div className="md:text-[60vh] text-[20vh]">
              <h1>Relio</h1>
            </div>
          </section>

        </div>


      </main>

    </>
  )
}


