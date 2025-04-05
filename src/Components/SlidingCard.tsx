// Components/SlidingCitationCard.tsx
import React, { useState, useEffect } from 'react'
import { Card, Badge, Text } from '@mantine/core'
import classes from './SlidingCard.module.css'

type CitationExample = {
  name: string
  example: string
}

interface SlidingCitationCardProps {
  examples: CitationExample[]
  interval?: number // Time in ms between slides
}

const SlidingCard: React.FC<SlidingCitationCardProps> = ({
  examples,
  interval = 8000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left')

  // Calculate the next index based on current
  const getNextIndex = (current: number) => (current + 1) % examples.length

  useEffect(() => {
    if (examples.length <= 1) return

    const timer = setInterval(() => {
      setSlideDirection('left') // Slide out to the left
      setIsSliding(true)

      // After animation completes, update the indices
      const updateTimer = setTimeout(() => {
        setCurrentIndex(nextIndex)
        setNextIndex(getNextIndex(nextIndex))
        setIsSliding(false)
      }, 500) // Match the animation duration

      return () => clearTimeout(updateTimer)
    }, interval)

    return () => clearInterval(timer)
  }, [examples.length, interval, currentIndex, nextIndex])

  if (examples.length === 0) {
    return (
      <Card withBorder p="md" radius="md">
        No examples available
      </Card>
    )
  }

  return (
    <div className={classes.slidingContainer}>
      {/* Current card - slides out */}
      <div
        className={`${classes.card} ${classes.currentCard} ${
          isSliding
            ? slideDirection === 'left'
              ? classes.slideOutLeft
              : classes.slideOutRight
            : ''
        }`}
      >
        <Card withBorder p="md" radius="md" style={{ height: '100%' }}>
          <Badge size="lg" mb="md" variant="filled" color="dark">
            {examples[currentIndex].name}
          </Badge>
          <Text className={classes.styleExample}>
            {examples[currentIndex].example}
          </Text>
        </Card>
      </div>

      {/* Next card - slides in */}
      <div
        className={`${classes.card} ${classes.nextCard} ${
          isSliding
            ? slideDirection === 'left'
              ? classes.slideInRight
              : classes.slideInLeft
            : ''
        }`}
      >
        <Card withBorder p="md" radius="md" style={{ height: '100%' }}>
          <Badge size="lg" mb="md" variant="filled" color="dark">
            {examples[nextIndex].name}
          </Badge>
          <Text className={classes.styleExample}>
            {examples[nextIndex].example}
          </Text>
        </Card>
      </div>

      {/* Navigation dots */}
      {examples.length > 1 && (
        <div className={classes.dotsContainer}>
          {examples.map((_, index) => (
            <div
              key={index}
              className={`${classes.dot} ${
                index === currentIndex ? classes.activeDot : ''
              }`}
              onClick={() => {
                if (index !== currentIndex && !isSliding) {
                  setSlideDirection(index > currentIndex ? 'left' : 'right')
                  setNextIndex(index)
                  setIsSliding(true)

                  setTimeout(() => {
                    setCurrentIndex(index)
                    setNextIndex(getNextIndex(index))
                    setIsSliding(false)
                  }, 500)
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SlidingCard
