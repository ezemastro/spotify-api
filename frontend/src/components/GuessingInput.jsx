import { useEffect, useRef } from 'react'

export default function GuessingInput ({ placeholder, answer, guessed, onGuess, name, value, statusChange }) {
  const inputRef = useRef()

  if (statusChange) {
    inputRef.current.value = guessed ? answer : ''
  }

  useEffect(() => {
    if (guessed) {
      if (Array.isArray(answer)) inputRef.current.value = answer.map(artist => artist.name).join(', ')
      else inputRef.current.value = answer
    }
  }, [guessed, answer])

  const handleGuess = (e) => {
    if (e.target.value === answer) onGuess(name)
    if (Array.isArray(answer) && answer.some(artist => artist.name === e.target.value)) onGuess(name)
  }

  return (
    <input type='text' placeholder={placeholder} ref={inputRef} readOnly={guessed || value === ' '} onChange={handleGuess} value={value} />
  )
}
