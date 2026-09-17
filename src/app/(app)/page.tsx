"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay"
import messages from "../../messages.json"

const Home = () => {
  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12">

        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Dive into the world of mystery Conversations</h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">Explore Mystery-Feedback - a platform for anonymous feedback where Your identity remain a secret.</p>
        </section>

        <Carousel plugins={[AutoPlay({ delay: 3000 })]} className="w-full max-w-48 sm:max-w-xs">
          <CarouselContent>
            {
              messages.map((message, index) => {
                return (
                  <CarouselItem key={index}>
                    <Card className="w-full h-48 sm:h-64">
                      <CardHeader>
                        <h3 className="text-lg sm:text-xl font-semibold text-center">{message.title}</h3>
                      </CardHeader>
                      <CardContent className="flex flex-col p-6 items-center justify-center h-full">
                        <p className="text-3xl font-semibold">{message.content}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                )
              })
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>


      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
            @Mystery-Feedback 2026. All rights reserved.
      </footer>
    </>
  )
}

export default Home
