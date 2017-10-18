export const nTimesDo = (times, toDo) => (
  Array.from(Array(times).keys()).map(
    (index) => toDo(index)
  )
)
