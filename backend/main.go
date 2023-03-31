package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"
	"github.com/jackc/pgx/v5"
	"github.com/go-chi/cors"
	"net/http"
	"os"

	model "github.com/jcleow/psql_visualization/model"
)

var routes = flag.Bool("routes", false, "Generate router documentation")
var conn *pgx.Conn

func init() {
	// urlExample := "postgres://username:password@localhost:5432/database_name"
	var err error
	conn, err = pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	if conn == nil {
		panic("Connection is nil")
	}
	fmt.Println("connection successful")
}

func main() {
	// Set up db connection using pgx
	defer conn.Close(context.Background())

	// Set up routes
	flag.Parse()

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins:   []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	  }))

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	r.Get("/panic", func(w http.ResponseWriter, r *http.Request) {
		panic("test")
	})

	// RESTy routes for "psql_stat_user_indexes" resource
	r.Route("/api/v1/index_usage", func(r chi.Router) {
		// r.Use(UserIndexesStatCtx)
		r.Get("/", GetPgStatUserIndexesHandler) // GET /pg_stat_user_indexes
	})

	if *routes {
		fmt.Println(docgen.MarkdownRoutesDoc(r, docgen.MarkdownOpts{
			ProjectPath: "github.com/go-chi/chi/v5",
			Intro:       "Welcome to the chi/_examples/rest generated docs.",
		}))
		return
	}

	http.ListenAndServe(":3333", r)
}

func GetPgStatUserIndexesHandler(w http.ResponseWriter, r *http.Request) {

	// UserIndexStats := r.Context().Value("UserIndexesStatCtx").(*[]model.PgStatUserIndex)
	stats, _ := dbGetPgStatUserIndexes()
	pgStats := model.PgStatUserIndexes(*stats)
	if err := render.Render(w, r, &pgStats); err != nil {
		render.Render(w, r, ErrRender(err))
	}

}

func dbGetPgStatUserIndexes() (*[]model.PgStatUserIndex, error) {
	sqlStmt := `
	SELECT
		idstat.relname AS TABLE_NAME,
		indexrelname AS index_name,
		idstat.idx_scan AS index_scans_count,
		idstat.idx_tup_read as index_scan_tuple_read,
		idstat.idx_tup_fetch as index_scan_tuple_fetch,
		pg_relation_size(indexrelid) AS index_size,
		tabstat.idx_scan AS table_reads_index_count,
		tabstat.seq_scan AS table_reads_seq_count,
		tabstat.seq_scan + tabstat.idx_scan AS table_reads_count,
		n_tup_upd + n_tup_ins + n_tup_del AS table_writes_count,
		pg_relation_size(idstat.relid) AS table_size
	FROM
		pg_stat_user_indexes AS idstat
	JOIN
		pg_indexes
		ON
		indexrelname = indexname
		AND
		idstat.schemaname = pg_indexes.schemaname
	JOIN
		pg_stat_user_tables AS tabstat
		ON
		idstat.relid = tabstat.relid
	WHERE
		indexdef !~* 'unique'
	ORDER BY
		idstat.idx_scan DESC,
		pg_relation_size(indexrelid) DESC
	`

	ctx := context.Background()
	rows, err := conn.Query(ctx, sqlStmt)
	data, err := pgx.CollectRows(rows, pgx.RowToStructByPos[model.PgStatUserIndex])
	if err != nil {
		err := fmt.Sprintf("CollectRows: %v", err)
		fmt.Printf(err)
		return &data, nil
	}

	return &data, nil
}

// Define Error handling related structs
type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

func ErrInvalidRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Invalid request.",
		ErrorText:      err.Error(),
	}
}

func ErrRender(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 422,
		StatusText:     "Error rendering response.",
		ErrorText:      err.Error(),
	}
}
