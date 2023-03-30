package model

import (
	"net/http"
)

type PgStatUserIndex struct {
	TableName            string `json:"table_name"`
	IndexName            string `json:"index_name"`
	IndexScansCount      int32  `json:"index_scans_count"`
	IndexScanTupleRead   int32  `json:"index_scan_tuple_read"`
	IndexScanTupleFetch  int32  `json:"index_scan_tuple_fetch"`
	IndexSize            int32  `json:"index_size"`
	TableReadsIndexCount int32  `json:"table_reads_index_count"`
	TableReadsSeqCount   int32  `json:"table_reads_seq_count"`
	TableReadsCount      int32  `json:"table_reads_count"`
	TableWritesCount     int32  `json:"table_writes_count"`
	TableSize            int32  `json:"table_size"`
}

type PgStatUserIndexes []PgStatUserIndex

type PgStatUserIndexRequest struct {
	*PgStatUserIndex
}

func (_ *PgStatUserIndexes) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}
