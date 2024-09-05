import type { Metadata } from 'next'
import { SudokuGame } from './Sudoku'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Page({ searchParams }: { searchParams: { mode: 'moomin' | 'default' } }) {
  console.log(searchParams)
  return (
    <>
      <h1>Rii-doku</h1>
      <SudokuGame mode={searchParams.mode} />
    </>
  )
}
