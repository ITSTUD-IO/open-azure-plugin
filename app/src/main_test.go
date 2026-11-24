package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRoutes(t *testing.T) {
	tests := []struct {
		name, method, path string
		status             int
		body               string
	}{
		{"root", http.MethodGet, "/", http.StatusOK, "{\"service\":\"open-azure-plugin-sample\"}\n"},
		{"health", http.MethodGet, "/healthz", http.StatusOK, "{\"status\":\"ok\"}\n"},
		{"unknown route", http.MethodGet, "/missing", http.StatusNotFound, ""},
		{"unsupported method", http.MethodPost, "/healthz", http.StatusMethodNotAllowed, ""},
	}
	handler := routes()
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			res := httptest.NewRecorder()
			handler.ServeHTTP(res, httptest.NewRequest(tc.method, tc.path, nil))
			if res.Code != tc.status {
				t.Fatalf("status = %d, want %d", res.Code, tc.status)
			}
			if tc.body != "" {
				if got := res.Header().Get("Content-Type"); got != "application/json" {
					t.Errorf("Content-Type = %q, want application/json", got)
				}
				if got := res.Body.String(); got != tc.body {
					t.Errorf("body = %q, want %q", got, tc.body)
				}
			}
		})
	}
}
