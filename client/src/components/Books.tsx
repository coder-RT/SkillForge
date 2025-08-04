
import type { BookProps } from "../types/Book";

import { BOOKS_QUERY } from '../graphql/queries/book1';
import { useQuery } from '@apollo/client';

const items = [
  { id: 1, name: 'Book 1', position: 1 },
  { id: 2, name: 'Book 2', position: 2 },
  { id: 3, name: 'Book 3', position: 3 },
]

const Books = () => {
    const { loading, error, data } = useQuery(BOOKS_QUERY, {
        variables: { limit: 100 },
      });
      
      if (loading) {
        return <p>Loading...</p>;
      }
      
      if (error) {
        return <p>Error: {error.message}</p>;
      }
      
      return (
        <ul>
          {data.books.map((item: BookProps) => {
            return (
              <li key={item.id}>
                <a href="#">{item.name}</a>
              </li>
            )
          })}
        </ul>
      );
      
//   return (
//     <ul>
//       {items.map((item: BookProps) => {
//         return (
//           <li key={item.id}>
//             <a href="#">{item.name}</a>
//           </li>
//         )
//       })}
//     </ul>
//   );
}

export default Books;



