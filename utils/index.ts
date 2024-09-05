export const formatSudoku = (solution: string): string[][] => {
  // Convert the solution string to an array of characters
  const data = solution.split('').map((val) => val.replace('-', ''))

  // Initialize an array to hold the 3x3 sub-grids
  const sudoku = []

  // Loop through the 3x3 sub-grids
  for (let gridRow = 0; gridRow < 3; gridRow++) {
    for (let gridCol = 0; gridCol < 3; gridCol++) {
      const section = []

      // Loop through each cell in a 3x3 sub-grid
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Calculate the correct index for the 3x3 sub-grid
          const rowIndex = gridRow * 3 + i
          const colIndex = gridCol * 3 + j
          const cellIndex = rowIndex * 9 + colIndex

          section.push(data[cellIndex])
        }
      }

      sudoku.push(section)
    }
  }

  return sudoku
}

export const unformatSudoku = (sudoku: string[][]): string => {
  // Initialize an array to hold the 81-character reconstructed string
  const data = Array(81).fill('')

  // Loop through each 3x3 sub-grid to reconstruct the original data
  for (let gridRow = 0; gridRow < 3; gridRow++) {
    for (let gridCol = 0; gridCol < 3; gridCol++) {
      const subgridIndex = gridRow * 3 + gridCol // Determine sub-grid index

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Calculate the correct position in the original data array
          const rowIndex = gridRow * 3 + i
          const colIndex = gridCol * 3 + j
          const cellIndex = rowIndex * 9 + colIndex

          // Place the value from the sub-grid back into its correct position
          data[cellIndex] = sudoku[subgridIndex][i * 3 + j] || '-'
        }
      }
    }
  }

  const reconstructedSolution = data.join('')
  return reconstructedSolution
}

export const hasAllOfValue = (arr: string[][], value: string): boolean => {
  return arr.every((row) => row.includes(value))
}
