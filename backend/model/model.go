package model

import (
	"net/http"
)

type PgStatUserIndex struct {
	TableName            string `json:"table_name"`
	IndexName            string `json:"index_name"`
	IndexScansCount      int64  `json:"index_scans_count"`
	IndexScanTupleRead   int64  `json:"index_scan_tuple_read"`
	IndexScanTupleFetch  int64  `json:"index_scan_tuple_fetch"`
	IndexSize            int64  `json:"index_size"`
	TableReadsIndexCount int64  `json:"table_reads_index_count"`
	TableReadsSeqCount   int64  `json:"table_reads_seq_count"`
	TableReadsCount      int64  `json:"table_reads_count"`
	TableWritesCount     int64  `json:"table_writes_count"`
	TableSize            int64  `json:"table_size"`
}

type PgStatUserIndexes []PgStatUserIndex

type PgStatUserIndexRequest struct {
	*PgStatUserIndex
}

func (_ *PgStatUserIndexes) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}
