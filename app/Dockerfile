FROM golang:1.26-bookworm AS build
WORKDIR /src
ENV CGO_ENABLED=0 GOTOOLCHAIN=local
COPY go.mod ./
COPY src/ ./src/
RUN test -z "$(gofmt -l src)" && go vet ./... && go test -v ./...
RUN go build -trimpath -o /sample ./src

FROM scratch
COPY --from=build /sample /sample
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/sample"]
