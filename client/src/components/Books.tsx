
import type { BookProps } from "../types/Book";

// type BookProps = {
//     id: number,
//     name: string,
//     position: number,
// }

const items = [
  { id: 1, name: 'Book 1', position: 1 },
  { id: 2, name: 'Book 2', position: 2 },
  { id: 3, name: 'Book 3', position: 3 },
]

const Books = () => {
  return (
    <ul>
      {items.map((item: BookProps) => {
        return (
          <li key={item.id}>
            <a href="#">{item.name}</a>
          </li>
        )
      })}
    </ul>
  );
}

export default Books;
