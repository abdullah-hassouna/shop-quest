import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './DotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './ArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import '@/style/embla.css'
import { ProductInterface } from '@/types/product-type'
import ProductCard from '../ProductCard'

type PropType = {
  slides: ProductInterface[]
  options?: EmblaOptionsType
}

const ProductsCarousel: React.FC<PropType> = (props) => {
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
          {slides.map((product, index) => (
            <div className="embla__slide min-w-[25vw] p-0 m-0" style={{ flex: '0 0 25vw' }} key={index}>
              <ProductCard product={product} key={product.id + "-" + product.name} />
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

export default ProductsCarousel
