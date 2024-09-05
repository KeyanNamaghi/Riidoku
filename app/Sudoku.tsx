'use client'
import { getSudoku } from 'sudoku-gen'

import styles from './sudoku.module.css'
import { formatSudoku } from '../utils'
import { useEffect, useReducer, useState } from 'react'
import Image from 'next/image'

export const SudokuGame = ({ mode = 'default' }: { mode: 'default' | 'moomin' }) => {
  const [startAudio, setStartAudio] = useState<HTMLAudioElement>()
  const [wrongAudio, setWrongAudio] = useState<HTMLAudioElement>()

  useEffect(() => {
    setStartAudio(new Audio('/lets-go.mp3'))
    setWrongAudio(new Audio('/dumb.m4a'))
  }, [])

  function reducer(
    state: {
      puzzle: string[][]
      initial: string[][]
      solution: string[][]
      difficulty?: string
      status: string
    },
    action: {
      type: string
      selected?: [number, number]
      value?: string
      sudoku?: { puzzle: string; solution: string; difficulty: string }
    }
  ) {
    if (action.type === 'update') {
      const [section, cell] = action.selected ?? [0, 0]

      // If the cell is an initial value, do nothing
      if (state.initial[section][cell] !== '') return state

      const puzzle = structuredClone(state.puzzle)
      puzzle[section][cell] = `${action.value}`

      // If the value is incorrect, play a sound
      if (puzzle[section][cell] !== state.solution[section][cell] && wrongAudio) {
        wrongAudio.play()
      }

      return {
        puzzle,
        initial: state.initial,
        solution: state.solution,
        difficulty: state.difficulty,
        status: state.solution.flat().join('') === puzzle.flat().join('') ? 'won' : 'playing',
      }
    }
    if (action.type === 'init') {
      const { puzzle, solution, difficulty } = action.sudoku ?? {}
      const formattedPuzzle = formatSudoku(puzzle ?? ' '.repeat(81))
      const formattedSolution = formatSudoku(solution ?? ' '.repeat(81))
      return {
        puzzle: formattedPuzzle,
        initial: formattedPuzzle,
        solution: formattedSolution,
        difficulty,
        status: 'playing',
      }
    }
    return state
  }

  const [selected, setSelected] = useState<[number, number] | undefined>(undefined)
  const emptyState = formatSudoku(' '.repeat(81))
  const [state, dispatch] = useReducer(reducer, {
    puzzle: emptyState,
    initial: emptyState,
    solution: emptyState,
    status: 'start',
  })

  const { puzzle, initial, solution, difficulty, status } = state

  if (status !== 'playing') {
    return (
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <button
          className={styles.button}
          onClick={() => {
            if (startAudio) startAudio.play()

            dispatch({ type: 'init', sudoku: getSudoku() })
          }}
        >
          New Game
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.sudokuBoard}>
        {puzzle.map((section, i) => (
          <div key={i} className={styles.sudokuSection}>
            {section.map((cell, j) => {
              const selectedStyle = selected?.[0] === i && selected?.[1] === j ? styles.selected : ''
              const initialStyle = initial[i][j] !== '' ? styles.initial : ''
              const errorStyle = cell && cell !== solution[i][j] ? styles.error : ''
              const highlightStyle =
                selected && cell && cell === puzzle[selected[0]][selected[1]] ? styles.highlight : ''
              const nothingSelected = !selected || puzzle[selected[0]][selected[1]] === '' ? styles.nothingSelected : ''

              return (
                <div
                  key={j}
                  className={`${styles.sudokuTile} ${selectedStyle} ${initialStyle} ${errorStyle} ${highlightStyle} ${nothingSelected}`}
                  onClick={() => setSelected([i, j])}
                >
                  {mode === 'default' && cell}
                  {mode === 'moomin' && cell !== '' && cell !== ' ' && (
                    <div
                      className={`${styles.tileImage} ${selectedStyle} ${initialStyle} ${errorStyle} ${highlightStyle}`}
                    >
                      <Image src={`/moomin/${cell}.png`} alt={cell} fill={true} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className={styles.numbers}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((value) => {
          const completed = puzzle.every((row) => row.includes(value))
          return (
            <button
              key={value}
              style={{ position: 'relative' }}
              className={completed ? styles.completed : ''}
              onClick={() => {
                dispatch({ type: 'update', selected: selected, value })
              }}
            >
              {mode === 'default' && value}
              {mode === 'moomin' && <Image src={`/moomin/${value}.png`} alt={value} fill={true} />}
            </button>
          )
        })}
        <button
          onClick={() => {
            dispatch({ type: 'update', selected: selected, value: '' })
          }}
        >
          {'<'}
        </button>
      </div>
      <div className={styles.numbers}>{difficulty}</div>
    </div>
  )
}
