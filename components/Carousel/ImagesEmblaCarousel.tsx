import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './DotButton'
import type { Image } from "@prisma/client"
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './ArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import '@/style/embla.css'

type PropType = {
  slides: Image[]
  options?: EmblaOptionsType
}

const ImagesCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="embla w-[80vw] min-w-0 p-0 m-0">
      <div className="embla__viewport w-[80vw] min-w-0 p-0 m-0 overflow-hidden" ref={emblaRef}>
        <div className="embla__container w-[80vw] min-w-0 flex p-0 m-0">
          {slides.map((Img, index) => (
            <div className="embla__slide min-w-full p-0 m-0" key={index}>
              <img src={Img.url} alt={Img.alt || "image of product"} key={Img.id} />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={
                'embla__dot' + (index === selectedIndex ? ' embla__dot--selected' : '')
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImagesCarousel
