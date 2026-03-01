# syntax=docker/dockerfile:1

FROM golang:1.24-alpine AS build

WORKDIR /app

COPY ytdlp/go.mod ./
RUN go mod download

COPY ytdlp/*.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /server

# --- Use alpine because scratch cannot execute external binaries such as yt-dlp ---
FROM alpine:3.21

# CA certificates + Python (required for yt-dlp)
RUN apk add --no-cache ca-certificates python3 py3-pip && \
    pip install --no-cache-dir --break-system-packages "yt-dlp>=2026.02.21" && \
    # Sanity check and binary path verification
    yt-dlp --version

COPY --from=build /server /server

RUN adduser -D -u 1000 appuser
USER appuser

EXPOSE 8080

CMD ["/server"]
