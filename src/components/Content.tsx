import { useEffect, useState } from "react";
import { AutoSizer, Grid, GridCellRenderer } from "react-virtualized";
import { api } from "../services/api";
import { MovieCard } from "./MovieCard";

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface GenreResponseProps {
  id: number;
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family";
  title: string;
}

interface ContentProps {
  selectedGenreId: number;
}

export function Content(props: ContentProps) {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps
  );

  useEffect(() => {
    api
      .get<MovieProps[]>(`movies/?Genre_id=${props.selectedGenreId}`)
      .then((response) => {
        setMovies(response.data);
      });

    api
      .get<GenreResponseProps>(`genres/${props.selectedGenreId}`)
      .then((response) => {
        setSelectedGenre(response.data);
      });
  }, [props.selectedGenreId]);

  const cellRenderer: GridCellRenderer = ({
    columnIndex,
    rowIndex,
    key,
    style,
  }) => {
    return (
      <div key={key} style={style}>
        {movies.length > columnIndex + rowIndex * 3 && (
          <MovieCard
            title={movies[columnIndex + rowIndex * 3].Title}
            poster={movies[columnIndex + rowIndex * 3].Poster}
            runtime={movies[columnIndex + rowIndex * 3].Runtime}
            rating={movies[columnIndex + rowIndex * 3].Ratings[0].Value}
          />
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <header>
        <span className="category">
          Categoria:<span> {selectedGenre.title}</span>
        </span>
      </header>

      <main>
        <div className="movies-list">
          <AutoSizer>
            {({ height, width }) => (
              <Grid
                rowHeight={400}
                height={800}
                width={width}
                columnWidth={width / 3.1}
                columnCount={3}
                rowCount={Math.ceil(movies.length / 3)}
                overscanRowCount={1}
                cellRenderer={cellRenderer}
              />
            )}
          </AutoSizer>
        </div>
      </main>
    </div>
  );
}
